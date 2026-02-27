'use client'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const Charts = ({ data: { salesData } }: { data: { salesData: { month: string, totalSales: number }[] } }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={salesData}>
        <XAxis
          dataKey={'month'}
          tickLine={false}
          axisLine={false}
          stroke={'#888'}
          fontSize={10}
        />
        <YAxis
          tickLine={false}
          tickFormatter={(value) => `₦${ value.toLocaleString() }`}
          axisLine={false}
          stroke={'#888'}
          fontWeight={600}
          fontSize={10}
        />
        <Bar dataKey={'totalSales'} fill='currentColor' radius={[ 4, 4, 0, 0 ]} className='fill-primary' />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Charts