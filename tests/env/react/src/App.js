import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { OneIndex } from './one-index'
import { MultipleIndexes } from './multiple-indexes'

const App = () => (
  <Routes>
    <Route path="/one-index" element={<OneIndex />}></Route>
    <Route path="/multiple-indexes" element={<MultipleIndexes />}></Route>
  </Routes>
)

export default App
