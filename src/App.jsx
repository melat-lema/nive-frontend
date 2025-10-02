import React from 'react';
import { Routes, Route } from 'react-router';
import Login from './markup/pages/Login';
import SignUp from './markup/pages/SignUp';
import Dashboard from './markup/pages/Dashboard';
import Music from './markup/pages/MusicTracker';
import Callback from './markup/pages/Callback';
import Books from './markup/pages/Books';
import BookReader from './markup/pages/BookReader';
import Expenses from './markup/pages/Expenses';
import Notes from './markup/pages/Notes';
import Goals from './markup/pages/Goals';
import Insights from './markup/pages/Insights';
import Settings from './markup/pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
     
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/music" element ={<Music/>}/>
      <Route path="/books" element={<Books/>}/>
      <Route path="/books/read/:id" element={<BookReader />} />
      <Route path="/callback" element={<Callback/>}/>
      <Route path="/expenses" element={<Expenses/>}/>
      <Route path="/notes" element={<Notes/>}/>
      <Route path='/goals' element={<Goals/>}/>
      <Route path="/insights" element={<Insights/>}/>
     <Route path="/settings" element={<Settings />} />
     
      {/* Add other routes here as needed */}
    </Routes>

  );
}
