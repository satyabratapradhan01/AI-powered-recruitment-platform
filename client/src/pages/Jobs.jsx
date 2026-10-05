import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockJobs } from '../data/seekerMockData';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card, { CardContent, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { Search, MapPin, Briefcase, DollarSign, Sparkles, Filter, ArrowRight, ExternalLink } from 'lucide-react';

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('match');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter jobs
  const filteredJobs = mockJobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.skills.some((s) => s.toLowerCase().includes(query));

    const matchesWorkMode = workModeFilter === 'All' || job.workMode === workModeFilter;
    const matchesType = typeFilter === 'All' || job.employmentType === typeFilter;

    return matchesQuery && matchesWorkMode && matchesType;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'recent') return a.id.localeCompare(b.id);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Recommended Jobs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse opportunities tailored to your resume, ATS match score, and technical skill set.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search job title, company, or skills (e.g. React, Node)..."
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
            onChange={(e) => setWorkModeFilter(e.target.value)}
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
              { value: 'match', label: 'Sort by: Highest AI Match' },
              { value: 'recent', label: 'Sort by: Most Recent' },
            ]}
            fullWidth={false}
          />
        </div>
      </div>

      {/* Content Area */}
      {paginatedJobs.length === 0 ? (
        <EmptyState
          title="No matching job postings found"
          description="Try refining your search keywords or resetting your work mode filters."
          actionLabel="Reset Search Filters"
          onAction={() => {
            setSearchQuery('');
            setWorkModeFilter('All');
            setTypeFilter('All');
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedJobs.map((job) => (
              <Card
                key={job.id}
                variant="interactive"
                className="flex flex-col justify-between group hover:border-indigo-300 h-full"
              >
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center font-bold text-slate-700 shrink-0">
                        {job.company[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition">
                          {job.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-600">{job.company}</p>
                      </div>
                    </div>

                    <Badge variant="purple" showDot size="xs">
                      {job.matchScore}% Match
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.location} • {job.workMode}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">{job.salary}</span>
                    </div>
                  </div>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Posted {job.postedDate}
                  </span>
                  <Link to={`/jobs/${job.id}`}>
                    <Button variant="primary" size="xs" rightIcon={ArrowRight}>
                      View Job
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
            totalItems={sortedJobs.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default Jobs;
