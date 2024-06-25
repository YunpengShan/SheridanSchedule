'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppProvider } from '@/app/app-provider';
import { useSelectedLayoutSegments } from 'next/navigation';
import { Transition } from '@headlessui/react';
import { getBreakpoint } from '../utils/utils';
import SidebarLinkGroup from './sidebar-link-group';
import SidebarLink from './sidebar-link';
import Logo from './logo';
import { User } from '../../types/types';

interface SidebarProps {
  user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const sidebar = useRef<HTMLDivElement>(null);
  const { sidebarOpen, setSidebarOpen } = useAppProvider();
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
  const segments = useSelectedLayoutSegments();
  const [breakpoint, setBreakpoint] = useState<string | undefined>(getBreakpoint());
  const expandOnly = !sidebarExpanded && (breakpoint === 'lg' || breakpoint === 'xl');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!sidebar.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen]);

  const handleBreakpoint = () => {
    setBreakpoint(getBreakpoint());
  };

  useEffect(() => {
    window.addEventListener('resize', handleBreakpoint);
    return () => {
      window.removeEventListener('resize', handleBreakpoint);
    };
  }, [breakpoint]);

  return (
    <div className={`min-w-fit ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
      
      {/* Sidebar backdrop (mobile only) */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto"
        show={sidebarOpen}
        enter="transition-opacity ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-out duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Transition
        show={sidebarOpen}
        unmount={false}
        as="div"
        id="sidebar"
        ref={sidebar}
        className="flex lg:!flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-72 lg:w-32 lg:sidebar-expanded:!w-72 2xl:!w-72 shrink-0 bg-white p-4 transition-all duration-200 ease-in-out"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <Logo />
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Pages</span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <SidebarLinkGroup open={segments.includes('dashboard')}>
                {(handleClick, open) => (
                  <>
                    <a
                      href="#0"
                      className={`block text-slate-200 truncate transition duration-150 ${
                        segments.includes('dashboard') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        expandOnly ? setSidebarExpanded(true) : handleClick();
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                            <path
                              className={`fill-current ${
                                segments.includes('dashboard') ? 'text-indigo-500' : 'text-slate-400'
                              }`}
                              d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                            />
                            <path
                              className={`fill-current ${
                                segments.includes('dashboard') ? 'text-indigo-600' : 'text-slate-600'
                              }`}
                              d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                            />
                            <path
                              className={`fill-current ${
                                segments.includes('dashboard') ? 'text-indigo-200' : 'text-slate-400'
                              }`}
                              d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                            />
                          </svg>
                          <span className="text-sm font-medium ml-3 text-gray-700 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            Dashboard
                          </span>
                        </div>
                        {/* Icon */}
                        <div className="flex shrink-0 ml-2">
                          <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                          </svg>
                        </div>
                      </div>
                    </a>
                    <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                      <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                        <li className="mb-1 last:mb-0">
                          <SidebarLink href="/dashboard">
                            <span className="text-sm font-medium text-gray-700 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Main
                            </span>
                          </SidebarLink>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>

              {/* My Course */}
              <SidebarLinkGroup open={segments.includes('myCourse')}>
                {(handleClick, open) => (
                  <>
                    <a
                      href="#0"
                      className={`block text-slate-200 truncate transition duration-150 ${
                        segments.includes('myCourse') ? 'hover:text-slate-200' : 'hover:text-white'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path  className={`fill-current ${
                                segments.includes('myCourse') ? 'text-indigo-500' : 'text-slate-400'
                              }`} strokeLinecap="round" strokeLinejoin="round" 
                              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" 
                            />
                          </svg>
                          <span className="text-sm font-medium ml-3 text-gray-700 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            My Course
                          </span>
                        </div>
                        {/* Icon */}
                        <div className="flex shrink-0 ml-2">
                          <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                          </svg>
                        </div>
                      </div>
                    </a>
                    <div className={`${!open && 'hidden'}`}>
                      <ul className="pl-9 mt-1">
                        {user?.courses?.map((course) => (
                          <SidebarLinkGroup key={course.name} open={segments.includes(course.name)}>
                            {(handleClick, open) => (
                              <>
                                <a
                                  href="#0"
                                  className={`block text-slate-200 truncate transition duration-150 ${
                                    segments.includes(course.name) ? 'hover:text-slate-200' : 'hover:text-white'
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleClick();
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path className={`fill-current ${
                                          segments.includes(course.name) ? 'text-indigo-500' : 'text-slate-400'
                                        }`} strokeLinecap="round" strokeLinejoin="round" 
                                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" 
                                        />
                                      </svg>
                                      <span className="text-sm font-medium ml-2 text-gray-700">{course.name}</span>
                                    </div>
                                    <div className="flex shrink-0 ml-2">
                                      <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                      </svg>
                                    </div>
                                  </div>
                                </a>
                                <div className={`${!open && 'hidden'}`}>
                                  <ul className="pl-2 mt-1">
                                    {/* Course Material */}
                                    <SidebarLinkGroup open={segments.includes('courseMaterial')}>
                                      {(handleClick, open) => (
                                        <>
                                          <a
                                            href="#0"
                                            className={`block text-slate-200 truncate transition duration-150 ${
                                              segments.includes('courseMaterial') ? 'hover:text-slate-200' : 'hover:text-white'
                                            }`}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleClick();
                                            }}
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                  <path className={`fill-current ${segments.includes('courseMaterial') ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round" 
                                                    d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" 
                                                  />
                                                </svg>
                                                <span className="text-sm font-medium ml-3 text-gray-700">Course Material</span>
                                              </div>
                                              <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                                                <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                              </svg>
                                            </div>
                                          </a>
                                          <div className={`${!open && 'hidden'}`}>
                                            <ul className="pl-2 mt-1">
                                              {course.course_material.map((material) => (
                                                <li key={material.filename} className="mb-1 last:mb-0">
                                                  <SidebarLink href={`/myCourse/${course.name}/courseMaterial/${material.filename}`}>
                                                    <span className="text-sm font-medium text-gray-700">{material.filename}</span>
                                                  </SidebarLink>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </>
                                      )}
                                    </SidebarLinkGroup>

                                    {/* Assignments */}
                                    <SidebarLinkGroup open={segments.includes('assignments')}>
                                      {(handleClick, open) => (
                                        <>
                                          <a
                                            href="#0"
                                            className={`block text-slate-200 truncate transition duration-150 ${
                                              segments.includes('assignments') ? 'hover:text-slate-200' : 'hover:text-white'
                                            }`}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleClick();
                                            }}
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                  <path className={`fill-current ${segments.includes('assignments') ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round"
                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" 
                                                  />
                                                </svg>
                                                <span className="text-sm font-medium ml-3 text-gray-700">Assignments</span>
                                              </div>
                                              <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                                                <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                              </svg>
                                            </div>
                                          </a>
                                          <div className={`${!open && 'hidden'}`}>
                                            <ul className="pl-2 mt-1">
                                              {course.assignments.map((assignment) => (
                                                <SidebarLinkGroup open={segments.includes(assignment.assignment_name)} key={assignment.assignment_name}>
                                                  {(handleClick, open) => (
                                                    <>
                                                      <a
                                                        href="#0"
                                                        className={`block text-slate-200 truncate transition duration-150 ${
                                                          segments.includes(assignment.assignment_name) ? 'hover:text-slate-200' : 'hover:text-white'
                                                        }`}
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          handleClick();
                                                        }}
                                                      >
                                                        <div className="flex items-center justify-between">
                                                          <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                              <path className={`fill-current ${segments.includes(assignment.assignment_name) ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round" 
                                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" 
                                                              />
                                                            </svg>
                                                            <span className="text-sm font-medium ml-3 text-gray-700">{assignment.assignment_name}</span>
                                                          </div>
                                                          <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                                          </svg>
                                                        </div>
                                                      </a>
                                                      <div className={`${!open && 'hidden'}`}>
                                                        <ul className="pl-2 mt-1">
                                                          <li className="pl-2 mb-1 last:mb-0">
                                                            <div className="flex items-center justify-between">
                                                              <SidebarLink href={`/myCourse/${course.name}/assignments/${assignment.assignment_name}/rubric`}>
                                                              <div className="flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                  <path className={`fill-current ${segments.includes('rubric') ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round" 
                                                                    d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                                                                  />
                                                                </svg>
                                                                <span className="text-sm font-medium text-gray-700 ml-3">Rubric</span>
                                                              </div>
                                                              </SidebarLink>
                                                            </div>
                                                          </li>
                                                          <li className="pl-2 mb-1 last:mb-0">
                                                            <div className="flex items-center">
                                                              <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                <path className={`fill-current ${segments.includes('stats') ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round" 
                                                                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                                                                />
                                                              </svg>
                                                              <SidebarLink href={`/myCourse/${course.name}/assignments/${assignment.assignment_name}/stats`}>
                                                                <span className="text-sm font-medium text-gray-700 ml-3">Stats</span>
                                                              </SidebarLink>
                                                            </div>
                                                          </li>
                                                          <SidebarLinkGroup open={segments.includes('submissions')}>
                                                            {(handleClick, open) => (
                                                              <>
                                                                <a
                                                                  href="#0"
                                                                  className={`block text-slate-200 truncate transition duration-150 ${
                                                                    segments.includes('submissions') ? 'hover:text-slate-200' : 'hover:text-white'
                                                                  }`}
                                                                  onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleClick();
                                                                  }}
                                                                >
                                                                  <div className="flex items-center justify-between">
                                                                    <div className="mx-2 flex items-center">
                                                                      <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                        <path className={`fill-current ${segments.includes('submissions') ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round" 
                                                                          d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
                                                                        />
                                                                      </svg>
                                                                      <span className="text-sm font-medium ml-3 text-gray-700">Submissions</span>
                                                                    </div>
                                                                    <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`} viewBox="0 0 12 12">
                                                                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                                                    </svg>
                                                                  </div>
                                                                </a>
                                                                <div className={`${!open && 'hidden'}`}>
                                                                  <ul className="pl-2 mt-1">
                                                                    {assignment.submissions.map((submission) => (
                                                                      <li key={submission.submission_index} className="pl-2 mb-1 last:mb-0">
                                                                        <SidebarLink href={`/myCourse/${course.name}/assignments/${assignment.assignment_name}/submissions/${submission.submission_index}`}>
                                                                          <div className="flex items-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                              <path className={`fill-current ${segments.includes(`${submission.submission_index}`) ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round" 
                                                                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" 
                                                                              />
                                                                            </svg>
                                                                            <span className="text-sm font-medium text-gray-700 ml-3">Submission #{submission.submission_index}</span>
                                                                          </div>
                                                                        </SidebarLink>
                                                                      </li>
                                                                    ))}
                                                                  </ul>
                                                                </div>
                                                              </>
                                                            )}
                                                          </SidebarLinkGroup>
                                                        </ul>
                                                      </div>
                                                    </>
                                                  )}
                                                </SidebarLinkGroup>
                                              ))}
                                            </ul>
                                          </div>
                                        </>
                                      )}
                                    </SidebarLinkGroup>
                                  </ul>
                                </div>
                              </>
                            )}
                          </SidebarLinkGroup>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </SidebarLinkGroup>
       
              {/* SharedWithMe */}
              <li className={`px-0 py-2 rounded-sm mb-0.5 last:mb-0 ${segments.includes('sharedWithMe') && 'bg-white'}`}>
                <SidebarLink href="/sharedWithMe">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path className={`fill-current ${segments.includes('sharedWithMe') ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                  </svg>
                  <span className="text-sm font-medium ml-3 text-gray-700 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Shared with me
                  </span>
                </div>

                </SidebarLink>
              </li>

              {/* Recents */}
              <li className={`px-0 py-2 rounded-sm mb-0.5 last:mb-0 ${segments.includes('recents') && 'bg-white'}`}>
                <SidebarLink href="/recents">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path className={`fill-current ${segments.includes('recents') ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="text-sm font-medium ml-3 text-gray-700 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Recents
                    </span>
                  </div>
                </SidebarLink>
              </li>

              {/* Starred */}
              <li className={`px-0 py-2 rounded-sm mb-0.5 last:mb-0 ${segments.includes('starred') ? 'bg-white' : ''}`}>
                <SidebarLink href="/starred">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path className={`fill-current ${segments.includes('starred') ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                    <span className={`text-sm font-medium ml-3 ${segments.includes('starred') ? 'text-indigo-500' : 'text-gray-700'} lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200`}>
                      Starred
                    </span>
                  </div>
                </SidebarLink>
              </li>

              {/* Bin */}
              <li className={`px-0 py-2 rounded-sm mb-0.5 last:mb-0 ${segments.includes('bin') ? 'bg-white' : ''}`}>
                <SidebarLink href="/bin">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path className={`fill-current ${segments.includes('bin') ? 'text-indigo-500' : 'text-slate-400'}`} strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    <span className={`text-sm font-medium ml-3 ${segments.includes('bin') ? 'text-indigo-500' : 'text-gray-700'} lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200`}>
                      Bin
                    </span>
                  </div>
                </SidebarLink>
              </li>
            </ul>
          </div>

          {/* Admin group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Admin</span>
            </h3>
            <ul className="mt-3">

              {/* Insights */}
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${open ? 'hover:text-slate-200' : 'hover:text-white'}`}
                        onClick={(e) => {
                          e.preventDefault()
                          expandOnly ? setSidebarExpanded(true) : handleClick()
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                              <path
                                className="fill-current text-slate-600"
                                d="M19 5h1v14h-2V7.414L5.707 19.707 5 19H4V5h2v11.586L18.293 4.293 19 5Z"
                              />
                              <path
                                className="fill-current text-slate-400"
                                d="M5 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm14 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8ZM5 23a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm14 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                              />
                            </svg>
                            <span className="text-sm font-medium ml-3 text-gray-700 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Insights
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl- mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/onboarding-01">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Step 1
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/onboarding-02">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Step 2
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/onboarding-03">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Step 3
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/onboarding-04">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Step 4
                              </span>
                            </SidebarLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )
                }}
              </SidebarLinkGroup>

              {/* Settings */}
              <SidebarLinkGroup open={segments.includes('settings')}>
                {(handleClick, open) => {
                  return (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${segments.includes('settings') ? 'hover:text-slate-200' : 'hover:text-white'
                          }`}
                        onClick={(e) => {
                          e.preventDefault()
                          expandOnly ? setSidebarExpanded(true) : handleClick()
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                              <path
                                className={`fill-current ${segments.includes('settings') ? 'text-indigo-500' : 'text-slate-600'}`}
                                d="M19.714 14.7l-7.007 7.007-1.414-1.414 7.007-7.007c-.195-.4-.298-.84-.3-1.286a3 3 0 113 3 2.969 2.969 0 01-1.286-.3z"
                              />
                              <path
                                className={`fill-current ${segments.includes('settings') ? 'text-indigo-300' : 'text-slate-400'}`}
                                d="M10.714 18.3c.4-.195.84-.298 1.286-.3a3 3 0 11-3 3c.002-.446.105-.885.3-1.286l-6.007-6.007 1.414-1.414 6.007 6.007z"
                              />
                              <path
                                className={`fill-current ${segments.includes('settings') ? 'text-indigo-500' : 'text-slate-600'}`}
                                d="M5.7 10.714c.195.4.298.84.3 1.286a3 3 0 11-3-3c.446.002.885.105 1.286.3l7.007-7.007 1.414 1.414L5.7 10.714z"
                              />
                              <path
                                className={`fill-current ${segments.includes('settings') ? 'text-indigo-300' : 'text-slate-400'}`}
                                d="M19.707 9.292a3.012 3.012 0 00-1.415 1.415L13.286 5.7c-.4.195-.84.298-1.286.3a3 3 0 113-3 2.969 2.969 0 01-.3 1.286l5.007 5.006z"
                              />
                            </svg>
                            <span className="text-sm font-medium ml-3 text-gray-700 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Settings
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/settings/account">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                My Account
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/settings/notifications">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                My Notifications
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/settings/apps">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Connected Apps
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/settings/plans">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Plans
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/settings/billing">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Billing & Invoices
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/settings/feedback">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Give Feedback
                              </span>
                            </SidebarLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )
                }}
              </SidebarLinkGroup>
            </ul>
          </div>

          {/* Auth group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Auth</span>
            </h3>
            <ul className="mt-3">
              {/* Authentication */}
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <>
                      <a
                        href="#0"
                        className={`block text-slate-200 truncate transition duration-150 ${open ? 'hover:text-slate-200' : 'hover:text-white'}`}
                        onClick={(e) => {
                          e.preventDefault()
                          expandOnly ? setSidebarExpanded(true) : handleClick()
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                              <path className="fill-current text-slate-600" d="M8.07 16H10V8H8.07a8 8 0 110 8z" />
                              <path className="fill-current text-slate-400" d="M15 12L8 6v5H0v2h8v5z" />
                            </svg>
                            <span className="text-sm font-medium ml-3 text-gray-700 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Authentication
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg
                              className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && 'rotate-180'}`}
                              viewBox="0 0 12 12"
                            >
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-9 mt-1 ${!open && 'hidden'}`}>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/signin">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Sign in
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/signup">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Sign up
                              </span>
                            </SidebarLink>
                          </li>
                          <li className="mb-1 last:mb-0">
                            <SidebarLink href="/reset-password">
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                Reset Password
                              </span>
                            </SidebarLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )
                }}
              </SidebarLinkGroup>


              
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
}
