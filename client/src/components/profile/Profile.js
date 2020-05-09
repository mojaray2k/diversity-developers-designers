import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEduction from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";

const Profile = ({ getProfileById, profile: { profile }, auth, match }) => {
  /*
   use a nullProfile boolean to safely add to useEffect
   adding profile to useEffect would trigger the function
   as profile is an object and object's are reference types
*/
  const nullProfile = !profile;
  useEffect(() => {
    if (nullProfile) getProfileById(match.params.id);
  }, [getProfileById, match.params.id, nullProfile]);
  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back To Profiles
          </Link>
          <div className='profile-grid my-1'>
            {/* Top */}
            <ProfileTop profile={profile} />

            {/* About */}
            <ProfileAbout />

            {/* <!-- Experience --> */}
            <ProfileExperience />

            {/* <!-- Education --> */}
            <ProfileEduction />

            {/* <!-- Github --> */}
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
