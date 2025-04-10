import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Page = () => {
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handleMessage(e) {
    setMsg(e.target.value);
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.txt')) {
        const emails = await file.text()
          .then(text => text.split('\n').map(e => e.trim()).filter(Boolean));
        setEmailList(emails);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert to JSON array
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }); 
        // Flatten the array and filter valid emails
        const emails = jsonData
          .flat() // flatten the array
          .filter(email => typeof email === 'string') // string
          .map(email => email.trim())
          .filter(email => email && email.includes('@')); 

        setEmailList(emails);
        console.log('Extracted emails:', emails); 
      } else {
        alert('Please upload a valid .txt or .xlsx file');
      }
    } catch (error) {
      alert('Error reading file');
      console.error(error);
    }
  }

  function send() {
    if (!emailList.length) {
      alert('Please upload email list first');
      return;
    }

    setStatus(true);
    axios.post('http://localhost:5000/sendEmail', { msg, emailList })
      .then(function (response) {
        if (response.data === true) {
          alert('Email sent successfully');
          setEmailList([]); 
          setMsg('');
          document.querySelector('input[type="file"]').value = ''; 
        } else {
          alert('Email not sent');
        }
      })
      .catch((error) => {
        alert('An error occurred');
        console.log(error);
      })
      .finally(() => {
        setStatus(false);
      });
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
     
      <div className='bg-gradient-to-r from-yellow-500 to-red-600 text-white text-center rounded-t-lg py-6 shadow-lg'>
        <h1 className='text-5xl font-bold animate-glow'>BulkMail</h1>
      </div>

     
      <div className='bg-gradient-to-r from-aquam-400 to-yellow-600 text-white text-center py-6'>
        <h1 className='text-2xl font-semibold tracking-wider animate-glow-text'>We can help your business with sending multiple emails at once</h1>
      </div>

      <div className='bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-6'>
        <h1 className='text-3xl font-bold tracking-wider animate-glow-text'>Drag & Drop</h1>
      </div>

      <div className='bg-gradient-to-br from-green-500 to-violet-500 p-6 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-500'>
        <textarea
          onChange={handleMessage}
          value={msg}
          className='w-full h-32 p-4 outline-none border-4 border-yellow-600 rounded-lg focus:ring-2 focus:ring-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105'
          placeholder='Enter your email content here'
        />
      </div>

      <div className="my-6">
        <label className="block mb-2 text-lg font-semibold text-white">Upload Email List (text or Excel file):</label>
        <input
          type='file'
          onChange={handleFileUpload}
          accept=".txt,.xlsx,.xls"
          className='w-full border-4 border-dashed border-orange-500 p-4 rounded-md cursor-pointer hover:border-orange-600 transition-all ease-out'
        />
        <p className="mt-2 text-sm text-gray-400">
          Total emails in this file: {emailList.length}
        </p>
      </div>

 
      <button
        onClick={send}
        disabled={status}
        className={`w-full py-3 px-6 text-white font-bold rounded-md transition-all duration-300 ease-in-out ${
          status ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-yellow-600 hover:bg-gradient-to-l transform hover:scale-105'
        }`}
      >
        {status ? 'Sending...' : 'Send Emails'}
      </button>
    </div>
  );
};

export default Page;
