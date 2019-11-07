import '../../../reset.css';
import './landing.css';

const goToSite = document.querySelector('.goToSite');
function toSiteEvent() {
  location.replace('../../screens/index.html');
}
goToSite.addEventListener('click', toSiteEvent);
