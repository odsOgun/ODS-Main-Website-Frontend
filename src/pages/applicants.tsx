import { useState, useEffect, useCallback, useRef } from 'react';
import CustomTabBar from '../components/ui/customTabbar';
import { Input } from '../components/ui/input';
import { Search, Users, Building2 } from 'lucide-react';

interface Exhibitor {
  _id: string;
  fullName: string;
  email: string;
  organisation: string;
  phoneNumber: number;
  createdAt: string;
  updatedAt: string;
}

interface Sponsor {
  _id: string;
  fullName: string;
  email: string;
  organisation: string;
  phoneNumber: number;
  twitterLink?: string;
  linkedinLink?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

function Applicants() {
  const [activeTab, setActiveTab] = useState(0);
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [filteredExhibitors, setFilteredExhibitors] = useState<Exhibitor[]>([]);
  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exhibitorsLoading, setExhibitorsLoading] = useState(false);
  const [sponsorsLoading, setSponsorsLoading] = useState(false);
  const [error, setError] = useState('');

  // Use refs to track if data has been fetched to prevent duplicate calls
  const exhibitorsFetched = useRef(false);
  const sponsorsFetched = useRef(false);

  const tabs = ['Exhibitors', 'Sponsors'];

  const BASE_URL = 'https://ods2025.onrender.com/api/v1';

  useEffect(() => {
    // Only fetch if not already fetched
    if (!exhibitorsFetched.current) {
      fetchExhibitors();
    }
    if (!sponsorsFetched.current) {
      fetchSponsors();
    }
  }, []);

  useEffect(() => {
    // Handle search with debouncing and local filtering for better performance
    if (searchQuery.trim()) {
      // Use local filtering instead of API calls for better UX
      if (activeTab === 0) {
        const filtered = exhibitors.filter(
          (exhibitor) =>
            exhibitor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exhibitor.organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exhibitor.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredExhibitors(filtered);
      } else {
        const filtered = sponsors.filter(
          (sponsor) =>
            sponsor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sponsor.organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sponsor.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSponsors(filtered);
      }
    } else {
      // Reset to show all data when search is cleared
      if (activeTab === 0) {
        setFilteredExhibitors(exhibitors);
      } else {
        setFilteredSponsors(sponsors);
      }
    }
  }, [searchQuery, activeTab, exhibitors, sponsors]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const fetchExhibitors = async () => {
    if (exhibitorsLoading) return; // Prevent concurrent requests

    setExhibitorsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/exhibitor/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success' && data.exhibitors) {
        setExhibitors(data.exhibitors);
        setFilteredExhibitors(data.exhibitors);
        exhibitorsFetched.current = true; // Mark as fetched
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to fetch exhibitors');
      console.error(err);
    } finally {
      setExhibitorsLoading(false);
    }
  };

  const fetchSponsors = async () => {
    if (sponsorsLoading) return; // Prevent concurrent requests

    setSponsorsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/sponsor/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success' && data.sponsors) {
        setSponsors(data.sponsors);
        setFilteredSponsors(data.sponsors);
        sponsorsFetched.current = true; // Mark as fetched
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to fetch sponsors');
      console.error(err);
    } finally {
      setSponsorsLoading(false);
    }
  };

  // Manual refresh functions that bypass the ref check
  const refreshExhibitors = async () => {
    exhibitorsFetched.current = false;
    await fetchExhibitors();
  };

  const refreshSponsors = async () => {
    sponsorsFetched.current = false;
    await fetchSponsors();
  };

  const renderExhibitorsTable = () => (
    <div className='overflow-x-auto'>
      <table className='w-full bg-white rounded-lg shadow-sm'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Name
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Email
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Organization
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Mobile
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {filteredExhibitors.map((exhibitor) => (
            <tr key={exhibitor._id} className='hover:bg-gray-50'>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {exhibitor.fullName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {exhibitor.email}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {exhibitor.organisation}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {exhibitor.phoneNumber}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredExhibitors.length === 0 && (
        <div className='text-center py-8 text-gray-500'>
          <Users className='mx-auto h-12 w-12 text-gray-400' />
          <p className='mt-2'>No exhibitors found</p>
        </div>
      )}
    </div>
  );

  const renderSponsorsTable = () => (
    <div className='overflow-x-auto'>
      <table className='w-full bg-white rounded-lg shadow-sm'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Name
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Email
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Organization
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Mobile
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Website
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Social
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {filteredSponsors.map((sponsor) => (
            <tr key={sponsor._id} className='hover:bg-gray-50'>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {sponsor.fullName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{sponsor.email}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {sponsor.organisation}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {sponsor.phoneNumber}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:text-blue-900'
                  >
                    Visit
                  </a>
                )}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                <div className='flex space-x-2'>
                  {sponsor.linkedinLink && (
                    <a
                      href={sponsor.linkedinLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-900'
                    >
                      LI
                    </a>
                  )}
                  {sponsor.twitterLink && (
                    <a
                      href={sponsor.twitterLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-900'
                    >
                      TW
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredSponsors.length === 0 && (
        <div className='text-center py-8 text-gray-500'>
          <Building2 className='mx-auto h-12 w-12 text-gray-400' />
          <p className='mt-2'>No sponsors found</p>
        </div>
      )}
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Applicants Management</h1>
          <p className='mt-2 text-gray-600'>Manage exhibitors and sponsors for the event</p>
        </div>

        {/* Tabs */}
        <div className='mb-6'>
          <CustomTabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Search Bar */}
        <div className='mb-6'>
          <div className='relative max-w-md'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
            <Input
              type='text'
              placeholder={`Search ${tabs[activeTab].toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-red-800'>{error}</p>
          </div>
        )}

        {/* Content */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          {exhibitorsLoading && activeTab === 0 ? (
            <div className='text-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-2 text-gray-500'>Loading exhibitors...</p>
            </div>
          ) : sponsorsLoading && activeTab === 1 ? (
            <div className='text-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-2 text-gray-500'>Loading sponsors...</p>
            </div>
          ) : (
            <>
              {activeTab === 0 ? (
                <div>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold text-gray-900'>Exhibitors</h2>
                    <button
                      onClick={refreshExhibitors}
                      disabled={exhibitorsLoading}
                      className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {exhibitorsLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                  {renderExhibitorsTable()}
                </div>
              ) : (
                <div>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold text-gray-900'>Sponsors</h2>
                    <button
                      onClick={refreshSponsors}
                      disabled={sponsorsLoading}
                      className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {sponsorsLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                  {renderSponsorsTable()}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Applicants;
