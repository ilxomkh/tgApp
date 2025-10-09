import { useApi } from '../hooks/useApi.js';
import { useSurvey } from '../hooks/useSurvey.js';
import tallyApiService from '../services/tallyApi.js';

export const TallyApiCorrectUsage = () => {
  const { getTallyForms, getTallyFormById, loading: apiLoading, error: apiError } = useApi();
  const { getAvailableSurveys, getSurvey, loading: surveyLoading, error: surveyError } = useSurvey();

  const handleGetAllForms = async () => {
    try {
      const result = await getTallyForms();
      
      if (result.success) {
        
        result.data.forEach(form => {
        });
        
        return result.data;
      } else {}
    } catch (error) {}
  };

  const handleGetFormByRealId = async (realFormId) => {
    try {
      const result = await getTallyFormById(realFormId);
      
      if (result.success) {
        return result.data;
      } else {}
    } catch (error) {}
  };

  const handleGetSurveyByInternalId = async (internalId) => {
    try {
      const survey = await getSurvey(internalId);
      return survey;
    } catch (error) {}
  };

  const handleGetAvailableSurveys = async () => {
    try {
      const surveys = await getAvailableSurveys();
      return surveys;
    } catch (error) {}
  };

  const handleWrongUsage = async () => {
    try {
      
      const result = await getTallyFormById('registration');
      
      if (result.success) {
      } else {
      }
    } catch (error) {}
  };

  const handleCorrectWorkflow = async () => {
    try {
      
      const forms = await handleGetAllForms();
      
      if (forms && forms.length > 0) {
        const firstForm = forms[0];
        const realId = firstForm.id;
        
        
        await handleGetFormByRealId(realId);
        
        await handleGetAvailableSurveys();
        
        await handleGetSurveyByInternalId('registration');
      }
    } catch (error) {}
  };

  const handleGetIdMapping = async () => {
    try {
      const mapping = await tallyApiService.getFormIdMapping();
      return mapping;
    } catch (error) {}
  };

  return {
    handleGetAllForms,
    handleGetFormByRealId,
    handleGetSurveyByInternalId,
    handleGetAvailableSurveys,
    handleWrongUsage,
    handleCorrectWorkflow,
    handleGetIdMapping,
    loading: apiLoading || surveyLoading,
    error: apiError || surveyError
  };
};

export const TallyUsageExample = () => {
  const {
    handleGetAllForms,
    handleGetFormByRealId,
    handleGetSurveyByInternalId,
    handleGetAvailableSurveys,
    handleWrongUsage,
    handleCorrectWorkflow,
    handleGetIdMapping,
    loading,
    error
  } = TallyApiCorrectUsage();

  const runAllExamples = async () => {

    await handleCorrectWorkflow();
    await handleGetIdMapping();
    await handleWrongUsage();
    
  };

  return {
    runAllExamples,
    handleGetAllForms,
    handleGetFormByRealId,
    handleGetSurveyByInternalId,
    handleGetAvailableSurveys,
    handleWrongUsage,
    handleCorrectWorkflow,
    handleGetIdMapping,
    loading,
    error
  };
};

export default TallyApiCorrectUsage;
