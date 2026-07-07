import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import Setup from '../components/Setup'
import Interview from '../components/Interview'

const InterviewPage = () => {
    const [step, setStep] = useState(1);
    const [interviewData, setInterviewData] = useState<any>(null);
    const navigate = useNavigate();

  return (
      <div className=''>
          {step === 1 && (
              <Setup onStart={(data) => { setInterviewData(data); setStep(2)} } />
          )}
          {step === 2 && (
              <Interview interviewData={interviewData} onFinish={(report) => {
                  const id = report?.data?._id || interviewData?.interviewId;
                  if (id) {
                      navigate(`/app/interview-report/${id}`);
                  }
              }}/>
          )}
    </div>
  )
}

export default InterviewPage