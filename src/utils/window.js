import { MOBILE_BREAKPOINT } from '$config/frontend';

export const isMobile = () => (window.innerWidth <= MOBILE_BREAKPOINT);
