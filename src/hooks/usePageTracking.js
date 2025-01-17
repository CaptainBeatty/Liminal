import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPage } from "../utils/analytics";

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackPage(location.pathname);
  }, [location]);
};

export default usePageTracking;
