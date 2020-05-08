import React, { Fragment } from "react";

const Experience = () => {
  return (
    <Fragment>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Company</th>
            <th className='hide-sm'>Title</th>
            <th className='hide-sm'>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Web App Company, Inc.</td>
            <td className='hide-sm'>Senior Full Stack Javascript Developer</td>
            <td className='hide-sm'>07-01-2019 - Now</td>
            <td>
              <button className='btn btn-danger'>Delete</button>
            </td>
          </tr>
          <tr>
            <td>Comcast</td>
            <td className='hide-sm'>Senior Full Stack React Developer</td>
            <td className='hide-sm'>06-01-2019 - 06-30-2019</td>
            <td>
              <button className='btn btn-danger'>Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
};

export default Experience;
