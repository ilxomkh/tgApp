import { useState, useCallback } from 'react';

export const useSurveyModal = () => {
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const openSurveyModal = useCallback((survey) => {
    setSelectedSurvey(survey);
    setIsSurveyModalOpen(true);
  }, []);

  const closeSurveyModal = useCallback(() => {
    setIsSurveyModalOpen(false);
    setSelectedSurvey(null);
  }, []);

  return {
    isSurveyModalOpen,
    selectedSurvey,
    openSurveyModal,
    closeSurveyModal
  };
};
