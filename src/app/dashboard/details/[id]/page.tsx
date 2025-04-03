'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { supabase } from '@/utils/supabaseClient'
import Navbar from '@/components/Navbar'
import { TabletSmartphone, View, Timer } from "lucide-react";

interface VideoAnalytics {
  id: number
  date: string
  total_views_day: number
  total_time_day: number
  english_title: string
  level: number
  language: string
}

export default function DashboardDetails() {
  const params = useParams()
  const id = params.id
  
  const [data, setData] = useState<VideoAnalytics[]>([])
  const [filteredData, setFilteredData] = useState<VideoAnalytics[]>([])
  const [filters, setFilters] = useState({
    english_title: '',
    level: '',
    language: '',
    fromDate: null as Date | null,
    toDate: null as Date | null
  })
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const { data: video_analytics, error } = await supabase
        .from('video_analytics')
        .select('*')
        .eq('user_id', id)

      if (error) {
        console.error('Error fetching data:', error)
      } else {
        setData(video_analytics)
        setFilteredData(video_analytics)
      }
    }
    fetchData()
  }, [id, supabase])

  // Apply filters
  const applyFilters = () => {
    let filtered = [...data]
    
    if (filters.english_title) {
      filtered = filtered.filter(item => 
        item.english_title.toLowerCase().includes(filters.english_title.toLowerCase())
      )
    }
    
    if (filters.level) {
      filtered = filtered.filter(item => 
        item.level === Number(filters.level)  // Convert to number for comparison
      )
    }

    if (filters.language) {
      filtered = filtered.filter(item => 
        item.language === filters.language
      )
    }
    
    if (filters.fromDate) {
      const fromDate = new Date(filters.fromDate)
      fromDate.setHours(0, 0, 0, 0)  // Set to start of day
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date)
        itemDate.setHours(0, 0, 0, 0)
        return itemDate >= fromDate
      })
    }
    
    if (filters.toDate) {
      const toDate = new Date(filters.toDate)
      toDate.setHours(23, 59, 59, 999)  // Set to end of day
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date)
        itemDate.setHours(0, 0, 0, 0)
        return itemDate <= toDate
      })
    }
    
    setFilteredData(filtered)
  }

  // Reset filters function
  const resetFilters = () => {
    setFilters({
      english_title: '',
      level: '',
      language: '',
      fromDate: null,
      toDate: null
    })
    setFilteredData(data)
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return

    alert(`Are you sure you want to delete ${selectedRows.length} rows?`);
    
    const { error } = await supabase
      .from('video_analytics')
      .delete()
      .in('id', selectedRows)

    if (error) {
      console.error('Error deleting rows:', error)
    } else {
      setData(data.filter(item => !selectedRows.includes(item.id)))
      setFilteredData(filteredData.filter(item => !selectedRows.includes(item.id)))
      setSelectedRows([])
    }
  }

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ['Sl No.', 'Title', 'Language', 'Total Views', 'Total Watch Time (s)', 'Date'],
      ...filteredData.map((item, index) => [
        index + 1,
        item.english_title,
        item.language,
        item.total_views_day,
        item.total_time_day,
        item.date
      ])
    ]
    .map(row => row.join(','))
    .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'video_analytics.csv'
    a.click()
  }

  return (
    <div className='min-h-screen bg-[#ECE6F0]'>
      <Navbar />


      <div className="grid grid-cols-4 gap-8 p-6 pb-0">
          <div className="flex items-center justify-center p-6 gap-1 bg-white rounded-md flex-col">
            <TabletSmartphone color={"purple"} size={35} />
            <p className="text-black text-2xl font-black">{id}</p>
            <p className="text-gray-600 text-sm">Total Devices</p>
          </div>
          <div className="flex items-center justify-center p-6 gap-1 bg-white rounded-md flex-col">
            <View color={"purple"} size={35} />
            <p className="text-black text-xl font-black">
              {filteredData.length > 0 
                ? new Date(Math.max(...filteredData.map(item => new Date(item.date).getTime()))).toLocaleDateString()
                : '-'}
            </p>
            <p className="text-gray-600 text-sm">Last Synced</p>
          </div>
          <div className="flex items-center justify-center p-6 gap-1 bg-white rounded-md flex-col">
            <View color={"purple"} size={35} />
            <p className="text-black text-xl font-black">
              {filteredData.reduce((sum, item) => sum + item.total_views_day, 0)}
            </p>
            <p className="text-gray-600 text-sm">Total Views</p>
          </div>
          <div className="flex items-center justify-center p-6 gap-1 bg-white rounded-md flex-col">
            <Timer color={"purple"} size={35} />
            <p className="text-black text-xl font-black">
              {filteredData.reduce((sum, item) => sum + item.total_time_day, 0)}
            </p>
            <p className="text-gray-600 text-sm">Total Watch Time (s)</p>
          </div>
        </div>

      <div className="p-6">
       
      {/* Filters */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-6 gap-4">
        <input
          type="text"
          placeholder="Filter by title"
          value={filters.english_title}
          onChange={(e) => setFilters({ ...filters, english_title: e.target.value })}
          className="placeholder:text-gray-800 text-gray-800 border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
        />
        
        <select
          value={filters.level}
          onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          className="placeholder:text-gray-800 text-gray-800 border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
        >
          <option value="">Select Level</option>
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <option key={level} value={level}>
              Level {level}
            </option>
          ))}
        </select>

        <select
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          className="placeholder:text-gray-800 text-gray-800 border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
        >
          <option value="">Select Language</option>
          <option value="en">English</option>
          <option value="pa">Punjabi</option>
        </select>

        <DatePicker
          selected={filters.fromDate}
          onChange={(date) => setFilters({ ...filters, fromDate: date })}
          placeholderText="From Date"
          dateFormat="yyyy-MM-dd"
          className="placeholder:text-gray-800 text-gray-800 border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none w-full"
        />
        
        <DatePicker
          selected={filters.toDate}
          onChange={(date) => setFilters({ ...filters, toDate: date })}
          placeholderText="To Date"
          dateFormat="yyyy-MM-dd"
          className="placeholder:text-gray-800 text-gray-800 border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none w-full"
        />

      </div>

      {/* Actions */}
      <div className="mb-4 flex gap-4">
      <button
            onClick={applyFilters}
            className="bg-purple-700 hover:bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm transition-colors duration-200 cursor-pointer"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md shadow-sm transition-colors duration-200 cursor-pointer"
          >
            Reset Filters
          </button>
        <button
          onClick={handleExport}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 cursor-pointer"
        >
          Export Data
        </button>
        <button
          onClick={handleBulkDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedRows.length === 0}
        >
          Delete Selected
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow max-h-[300px] overflow-y-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b border-gray-200 p-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-200"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(filteredData.map(item => item.id))
                    } else {
                      setSelectedRows([])
                    }
                  }}
                />
              </th>
              <th className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-gray-600">Sl No.</th>
              <th className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-gray-600">Title</th>
              <th className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-gray-600">Language</th>
              <th className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-gray-600">Level</th>
              <th className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-gray-600">Total Views</th>
              <th className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-gray-600">Total Watch Time (s)</th>
              <th className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-gray-600">Capture Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-200"
                    checked={selectedRows.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows([...selectedRows, item.id])
                      } else {
                        setSelectedRows(selectedRows.filter(id => id !== item.id))
                      }
                    }}
                  />
                </td>
                <td className="p-3 text-sm text-gray-500">{index + 1}</td>
                <td className="p-3 text-sm text-gray-800">{item.english_title}</td>
                <td className="p-3 text-sm text-gray-800">{item.language}</td>
                <td className="p-3 text-sm text-gray-800">{item.level}</td>
                <td className="p-3 text-sm text-gray-800">{item.total_views_day}</td>
                <td className="p-3 text-sm text-gray-800">{item.total_time_day}</td>
                <td className="p-3 text-sm text-gray-800">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}