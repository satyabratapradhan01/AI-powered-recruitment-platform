import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobsApi, getRecommendedJobsApi } from '../services/api';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card, { CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import { Search, MapPin, Briefcase, DollarSign, Sparkles, ArrowRight } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, workModeFilter, sortBy, currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchQuery || undefined,
        workMode: workModeFilter !== 'All' ? workModeFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
      };

      const response = await getJobsApi(params);
      const jobsList = response.data?.data || [];
      const pagination = response.data?.pagination || {};

      setJobs(jobsList);
      setTotalPages(pagination.totalPages || 1);
      setTotalItems(pagination.total || jobsList.length);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to fetch job opportunities');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Explore Open Job Positions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse opportunities posted by top recruiters, matched with AI skills and experience intelligence.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search job title, company, or required skills..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            leftIcon={Search}
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3">
          <Select
            value={workModeFilter}
            onChange={(e) => {
              setWorkModeFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'All', label: 'All Work Modes' },
              { value: 'Remote', label: 'Remote' },
              { value: 'Hybrid', label: 'Hybrid' },
              { value: 'Onsite', label: 'Onsite' },
            ]}
            fullWidth={false}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'recent', label: 'Sort by: Most Recent' },
              { value: 'match', label: 'Sort by: Featured' },
            ]}
            fullWidth={false}
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <ErrorState title="Error Loading Jobs" message={error} onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No matching job postings found"
          description="Try refining your search keywords or resetting your work mode filters."
          actionLabel="Reset Search Filters"
          onAction={() => {
            setSearchQuery('');
            setWorkModeFilter('All');
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const jobId = job._id || job.id;
              const requiredSkills = job.requiredSkills || job.skills || [];

              return (
                <Card
                  key={jobId}
                  variant="interactive"
                  className="flex flex-col justify-between group hover:border-indigo-300 h-full"
                >
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center font-bold text-slate-700 shrink-0">
                          {job.company ? job.company[0] : 'C'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition">
                            {job.title}
                          </h3>
                          <p className="text-xs font-semibold text-slate-600">{job.company}</p>
                        </div>
                      </div>

                      <Badge variant="purple" showDot size="xs">
                        {job.workMode || 'Full-time'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.location || 'Remote'} ({job.employmentType || 'Full-time'})</span>
                      </div>
                      {job.salaryMin ? (
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-700">
                            ${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Required Skill Badges */}
                    {requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {requiredSkills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                    <Link to={`/jobs/${jobId}`}>
                      <Button variant="primary" size="xs" rightIcon={ArrowRight}>
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;
