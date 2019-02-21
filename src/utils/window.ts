import { MOBILE_BREAKPOINT } from '$config/frontend';

export const isMobile = (): boolean => (window.innerWidth <= MOBILE_BREAKPOINT);
