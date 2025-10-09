import { useSurvey } from '../hooks/useSurvey.js';
import { useApi } from '../hooks/useApi.js';
import tallyApiService from '../services/tallyApi.js';

export const SurveyManager = () => {
  const { 
    getAvailableSurveys, 
    getSurvey, 
    getFormResponses, 
    syncTallyData,
    loading, 
    error 
  } = useSurvey();

  const { 
    getTallyForms, 
    getTallyFormById, 
    getTallyFormResponses, 
    syncTallyData: syncData 
  } = useApi();

  const handleGetSurveys = async () => {
    try {
      const surveys = await getAvailableSurveys();
      return surveys;
    } catch (error) {}
  };

  const handleGetSurvey = async (surveyId) => {
    try {
      const survey = await getSurvey(surveyId);
      return survey;
    } catch (error) {}
  };

  const handleGetResponses = async (formId) => {
    try {
      const responses = await getFormResponses(formId);
      return responses;
    } catch (error) {}
  };

  const handleSyncData = async (formId) => {
    try {
      const result = await syncTallyData(formId);
      return result;
    } catch (error) {}
  };

  const handleDirectApiCall = async () => {
    try {
      
      const formsResult = await getTallyForms();

      if (formsResult.success && formsResult.data.length > 0) {
        const firstForm = formsResult.data[0];
        
        const formResult = await getTallyFormById(firstForm.id);

        const responsesResult = await getTallyFormResponses(firstForm.id);

        const syncResult = await syncData({ formId: firstForm.id, action: 'sync' });
      }
    } catch (error) {
    }
  };

  const checkApiAvailability = async () => {
    try {
      const isAvailable = await tallyApiService.isServerApiAvailable();
      return isAvailable;
    } catch (error) {
      return false;
    }
  };

  return {
    handleGetSurveys,
    handleGetSurvey,
    handleGetResponses,
    handleSyncData,
    handleDirectApiCall,
    checkApiAvailability,
    loading,
    error
  };
};

export const SurveyExample = () => {
  const surveyManager = SurveyManager();

  const handleTestAll = async () => {
    
    const isApiAvailable = await surveyManager.checkApiAvailability();
    
    if (isApiAvailable) {
      
      const surveys = await surveyManager.handleGetSurveys();
      
      if (surveys && surveys.length > 0) {
        const firstSurvey = surveys[0];
        
        await surveyManager.handleGetSurvey(firstSurvey.id);
        
        await surveyManager.handleGetResponses(firstSurvey.formId);
        
        await surveyManager.handleSyncData(firstSurvey.formId);
      }
    } else {
      
      await surveyManager.handleGetSurveys();
    }
    
  };

  return {
    handleTestAll,
    loading: surveyManager.loading,
    error: surveyManager.error
  };
};

export default SurveyManager;
