import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import { LoadingSpinner, QuestionWizardChoice } from 'src/components';
import { fetchQuestionsAction } from 'src/actions';
import { push } from 'react-router-redux';
import _find from 'lodash/find';
import Helmet from 'react-helmet';

function fetchInitialQuestionAction(state) {
  let userId;

  if (state.session.user.role === 'guest') {
    userId = state.session.user.id;
  }

  return {
    type: 'CALL_API',
    method: 'get',
    url: `/api/wizard/${userId}/current_question`,
    successType: ['RECEIVE_QUESTION_SUCCESS', 'RESET_WIZARD', 'SET_CURRENT_WIZARD_QUESTION']
  };
}

function submitAnswerAction(id, data) {
  return {
    type: 'CALL_API',
    method: 'put',
    url: `/api/wizard/${id}/responses`,
    errorType: 'RECEIVE_ANSWER_SUBMIT_ERROR',
    data
  };
}

export class QuestionWizard extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchInitialQuestionAction(store.getState()));
  }

  constructor() {
    super();
    this.submitAnswer = this.submitAnswer.bind(this);
  }

  static propTypes = {
    fetchInitialQuestion: PropTypes.func.isRequired,
    fetchQuestions: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    submitAnswer: PropTypes.func.isRequired,
    selectChoice: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    currentQuestion: PropTypes.object,
    selectedChoiceId: PropTypes.number,
    user: PropTypes.object,
    _error: PropTypes.string
  };

  componentDidMount() {
    this.props.fetchInitialQuestion();
    this.props.fetchQuestions();
  }

  submitAnswer() {
    let {
      submitAnswer,
      currentQuestion,
      selectedChoiceId,
      user
    } = this.props;

    submitAnswer(currentQuestion.id, selectedChoiceId, user.id);
  }

  progressBarValue() {
    return (this.props.totalResponses / this.props.totalQuestions) * 100;
  }

  render() {
    let {
      currentQuestion,
      selectChoice,
      selectedChoiceId,
      _error,
      submitting
    } = this.props;

    require('./QuestionWizard.scss');
    if (!currentQuestion) {
      return <LoadingSpinner large absolute center/>;
    }

    return (<div className="container-QuestionWizard container">
      <Helmet title="Question Wizard"/>
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <div className="answer-question-wrapper clearfix">
            <ProgressBar now={this.progressBarValue()} bsStyle="success" striped active/>
            <div className="clearfix">
              <Link className="pull-right" to={`/my_resources`}>
                Skip To Resources &gt;
              </Link>
              <small>
                Please answer the following questions to
                help identify the best resources for you:
              </small>
            </div>
            <div className="col-xs-12 question">
              {currentQuestion.stem}
            </div>
            <div className="choices">
              {currentQuestion.choices.map(choice => {
                return (
                  <QuestionWizardChoice
                    {...choice}
                    key={choice.id}
                    selected={selectedChoiceId === choice.id}
                    selectChoice={selectChoice}
                  />);
              })}
            </div>
          </div>
          <div className="pull-right submit-box">
            {_error && <p className="text-danger">{_error}</p>}
            {selectedChoiceId &&
              <button className="btn btn-success btn-lg pull-right"
                type="submit" disabled={submitting}
                onClick={this.submitAnswer}
              >
              {submitting ? <LoadingSpinner/> : <i className="fa fa-paper-plane"/> } Submit
            </button>}
          </div>
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(state) {
  let currentQuestion = _find(state.question.questions, question => {
    return question.id === state.wizard.currentQuestionId;
  });


  return {
    currentQuestion,
    user: state.session.user,
    selectedChoiceId: state.wizard.selectedChoiceId,
    submitting: state.wizard.submitting,
    error: state.wizard.error,
    totalResponses: state.wizard.responses.length,
    totalQuestions: state.question.questions.length
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchInitialQuestion: () => {
      dispatch((dispatch, getState) => {
        dispatch(fetchInitialQuestionAction(getState()));
      });
    },
    fetchQuestions: () => {
      dispatch((dispatch, getState) => {
        if (getState().question.lastUpdated && getState().question.questions.length) {
          return;
        }

        dispatch({ type: 'REQUEST_QUESTIONS' });
        dispatch(fetchQuestionsAction());
      });
    },
    selectChoice: (choiceId) => {
      dispatch({ type: 'SELECT_CHOICE', choiceId });
    },
    submitAnswer: (questionId, choiceId, userId) => {
      let body = {
        question_id: questionId,
        choice_id: choiceId
      };
      dispatch({ type: 'REQUEST_ANSWER_SUBMIT', payload: { response: body } });
      return dispatch(submitAnswerAction(userId, body)).then(response => {

        if (!response.next_question) {
          setTimeout(() => {
            dispatch({ type: 'RECEIVE_ANSWER_SUBMIT_SUCCESS', response });
            dispatch(push(`/my_resources`));
          }, 500);
        } else {
          dispatch({ type: 'RECEIVE_ANSWER_SUBMIT_SUCCESS', response });
        }
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionWizard);
