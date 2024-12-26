import './Profile.css';
import profile from './profile.png';
import api from './apidoc.png'
function Profile(){
    return(
        <>
            <div class="profile">
                <div className="profile__top">

                </div>
                <div className="profile__bottom">
                    <div className="profile__card">
                        <div className="profile__image">
                        <img src={profile} alt="Profile" />
                        </div>
                        <div className="profile__info">
                            <div className="profile__name">
                                Vũ Công Duy - B21DCCN302
                            </div>
                            <div className="profile__position">
                                IOT beginner
                            </div>
                            <ul className="profile__social">
                                <li >
                                    <a className="profile__facebook" href="https://www.facebook.com/duyisthebet/" target='blank'>
                                        <i class="fa-brands fa-facebook-f"></i>
                                    </a>
                                </li>
                                <li >
                                    <a className="profile__instagram" href="https://github.com/ohminedaka"
                                    target='blank'>
                                        <i class="fa-brands fa-instagram"></i>
                                    </a>
                                </li>
                                <li >
                                    <a className="api" href="https://documenter.getpostman.com/view/33684327/2sAXxY5Ux4"
                                    target='blank'>
                                        <img src={api} alt="api" />
                                    </a>
                                </li>
                                <li >
                                    <a className="profile__github" href="https://github.com/ohminedaka"
                                    target='blank'>
                                        <i class="fa-brands fa-github"></i>
                                    </a>
                                </li>
                            </ul>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
};
export default Profile;


