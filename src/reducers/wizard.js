export const initialState = {
  responses: [],
  resources: [],
  currentQuestionId: null,
  selectedChoiceId: null,
  submitting: false,
  hasAnsweredAllQuestions: false,
  resourcesLastUpdated: null,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  let nextQuestionId;

  switch (action.type) {
    case 'SET_CURRENT_WIZARD_QUESTION':
      return {
        ...state,
        errors: null,
        currentQuestionId: action.payload.question.id
      };
    case 'SELECT_CHOICE':
      return {
        ...state,
        error: null,
        selectedChoiceId: action.choiceId
      };
    case 'REQUEST_ANSWER_SUBMIT':
      return {
        ...state,
        error: null,
        submitting: true,
      };
    case 'RECEIVE_ANSWER_SUBMIT_ERROR':
      return {
        ...state,
        submitting: false,
        error: 'We were unable to update this user. Please try again later.'
      };
    case 'RECEIVE_ANSWER_SUBMIT_SUCCESS':
      nextQuestionId = action.response.next_question && action.response.next_question.id;

      return {
        ...state,
        submitting: false,
        selectedChoiceId: null,
        responses: state.responses.concat(action.response.response),
        hasAnsweredAllQuestions: !nextQuestionId,
        currentQuestionId: nextQuestionId
      };

    case 'RECEIVE_PERSONALIZED_RESOURCES_SUCCESS':
      return {
        ...state,
        resources: action.payload.resources,
        resourcesLastUpdated: Date.now()
      };
    default:
      return state;
  }
}