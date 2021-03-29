import React, { useEffect, useState } from 'react';
import logo from '../../../assets/images/LogoeHome.png';
import './index.css';
import axios from 'axios';

const AdviserCards = ({ agentData }) => {
  return (
    <div className='profile_section_container mt-4 mb-4'>
      <div className='col-12 px-2 py-2 card'>
        <div className='d-flex icon_title_container align-items-center px-2'>
          <div>
            <img src='https://i.ibb.co/wSm9QHw/e-homeoffer-color-logo-new-copy-3-3x.png' />
          </div>
          <div className='px-4'>
            <h2 className='m-0'>Contact Agent</h2>
          </div>
        </div>

        <div className='py-3 px-0 d-flex profile_image_container'>
          <div>
            <img className='card-img-top' src={agentData.agentImage && agentData.agentImage} alt='Card' />
          </div>
          <div className='pt-3 pl-3'>
            <h3 className='m-0 py-1'>{agentData.agentName && agentData.agentName}</h3>
            {/* <h4 className='m-0'>Branch Manager</h4> */}
            <h5 className='m-0 py-1'>{agentData.agentAddress && agentData.agentAddress}</h5>
            <a href={agentData.agentTwitter && agentData.agentTwitter}>Visit My Site</a>
          </div>
        </div>

        <form className='px-3'>
          <div className='form-group'>
            <input className='form-control' placeholder='Full Name' />
          </div>

          <div className='form-group'>
            <input className='form-control' placeholder='Email' />
          </div>
          <div className='form-group'>
            <input className='form-control' placeholder='Phone Number' />
          </div>
          <div className='form-check py-1'>
            <input type='checkbox' className='form-check-input' id='exampleCheck1' />
            <label className='form-check-label' for='exampleCheck1'>
              I have served in the U.S. Military.
            </label>
          </div>
          <div className='form-check py-1'>
            <input type='checkbox' className='form-check-input' id='exampleCheck1' />
            <label className='form-check-label' for='exampleCheck1'>
              Get pre-approved by a lender.
            </label>
          </div>
          <div className='d-flex justify-content-center py-4'>
            <button type='submit' className='btn btn-primary px-5'>
              Email Realtor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdviserCards;
