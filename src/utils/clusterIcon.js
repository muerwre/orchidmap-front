import { divIcon } from 'leaflet';

export const clusterIcon = () => divIcon({
  html: `
    <div class="custom-marker-cluster">          
      <svg width="24" height="24" viewBox="-2 -2 36 36">            
        <circle cx="10" cy="20" fill="white" r="4" />
        <circle cx="22" cy="20" fill="white" r="4" />
        <circle cx="16" cy="10" fill="white" r="4" />  
      </svg>
    </div>
  `
});
