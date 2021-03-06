import React, { Component, PropTypes } from 'react';
import { LoadingSpinner, QuestionWizardChoice } from 'src/components';
import _includes from 'lodash/includes';

const KEYBOARD_CHOICES = ['1', '2', '3', '4'];
const KEYBOARD_SUBMIT = ['Enter'];

export default class Question extends Component {
  static propTypes = {
    className: PropTypes.string,
    choices: PropTypes.array.isRequired,
    enableKeybindings: PropTypes.bool.isRequired,
    error: PropTypes.string,
    stem: PropTypes.string.isRequired,
    selectChoice: PropTypes.func.isRequired,
    selectedChoiceId: PropTypes.number,
    submitAnswer: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  };

  static defaultProps = {
    className: '',
    enableKeybindings: true
  }

  componentDidMount() {
    this.setupKeyBindings();
  }

  componentWillUnmount() {
    this.removeKeyBindings();
  }

  isButtonDisabled() {
    return this.props.submitting || !this.props.selectedChoiceId;
  }

  removeKeyBindings() {
    global.document.removeEventListener('keyup', this.keyUpHandler, false);
  }

  setupKeyBindings() {
    global.document.addEventListener('keyup', this.keyUpHandler, false);
  }

  keyUpHandler = (event) => {
    if (!this.props.enableKeybindings) {
      return;
    }

    event.preventDefault();
    if (_includes(KEYBOARD_CHOICES, event.key)) {
      let selectedChoice = this.props.choices[+event.key - 1];
      if (selectedChoice) {
        this.props.selectChoice(selectedChoice.id);
      }
    }

    if (_includes(KEYBOARD_SUBMIT, event.key)) {
      this.props.submitAnswer();
    }
  }

  render() {
    let {
      className,
      choices,
      error,
      stem,
      selectChoice,
      selectedChoiceId,
      submitAnswer,
      submitting
    } = this.props;

    require('./Question.scss');
    return (<div className={`question ${className}`}>
      <div className="question-stem">
        {stem}
      </div>
      <div className="choices clearfix">
        {choices.map(choice => {
          return (
            <QuestionWizardChoice
              {...choice}
              key={choice.id}
              selected={selectedChoiceId === choice.id}
              selectChoice={selectChoice}
            />);
        })}
      </div>
      <div className="submit-wrapper clearfix">
        {error && <p className="text-danger">{error}</p>}
        <button className="btn btn-lg btn-success pull-right"
          type="submit" disabled={this.isButtonDisabled()}
          onClick={submitAnswer}
        >
          {submitting ? <LoadingSpinner/> : <i className="fa fa-paper-plane"/> } Submit
        </button>
        </div>
    </div>);
  }
}
