import React from 'react'


export default function SingleInspection( { inspection }) {
  return (
    <>
    <div className="dashboard-layout">
        <h4 className="dashboard-title">Inspection</h4>
        <div className="statistics-line-chart">
            <h1>{inspection.register_id}</h1>
        </div>
    </div>
    </>
  )
}