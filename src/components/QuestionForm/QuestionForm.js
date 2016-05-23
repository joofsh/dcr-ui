import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import {
  FormGroup,
  FontIcon,
  LoadingButton,
  ChoiceForm
} from 'src/components';

export class QuestionForm extends Component {
  static propTypes = {
    deleteQuestion: PropTypes.func.isRequired,
    toggleEditQuestion: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    submitting: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    id: PropTypes.number,
    error: PropTypes.string
  };

  constructor() {
    super();
    this.addChoice = this.addChoice.bind(this);
    this.removeChoice = this.removeChoice.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.toggleEditQuestion = this.toggleEditQuestion.bind(this);
  }

  addChoice() {
    this.props.fields.choices.addField({});
  }

  removeChoice(choiceIndex) {
    this.props.fields.choices.removeField(choiceIndex);
  }

  deleteQuestion() {
    this.props.deleteQuestion(this.props.id, this.props.index);
  }

  toggleEditQuestion() {
    this.props.toggleEditQuestion(this.props.index);
  }

  render() {
    let {
      fields: {
        order,
        stem,
        choices
      },
      id,
      index,
      submitting,
      handleSubmit,
      error,
      isEditing
    } = this.props;

    require('./QuestionForm.scss');
    return (<form className="questionForm clearfix" onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="col-xs-1">
          <div className="form-control-static">
            <b>ID:</b> {id || 'None'}
          </div>
        </div>
        <div className="col-xs-1">
          <FormGroup
            {...order}
            label={false}
            placeholder="Order"
            wrapperClassName="col-xs-12"
            isEditing={isEditing}
          />
        </div>
        <div className="col-xs-7">
          <FormGroup
            {...stem}
            labelClassName="col-xs-1"
            wrapperClassName="col-xs-10"
            isEditing={isEditing}
          />
        </div>
        <div className="col-xs-3 buttons">
          {error && <p className="text-danger error">{error}</p>}
          {isEditing && <div>
            <LoadingButton
              type="submit"
              text="Save"
              icon="paper-plane"
              isLoading={submitting}
              disabled={submitting}
              className="btn-success pull-left"
            />
            <button type="button" className="btn btn-primary pull-left" onClick={this.addChoice}>
              <FontIcon type="plus"/> Choice
            </button>
          </div>}
          <button type="button" className="btn btn-danger pull-right"
            onClick={this.deleteQuestion}
          >
            <FontIcon type="trash"/>
          </button>
          <button type="button" className="btn btn-warning pull-right"
            onClick={this.toggleEditQuestion}
          >
            <FontIcon type="pencil"/>
          </button>
        </div>
      </div>
      <div className="row">
        {choices.map((choice, j) => (
          <ChoiceForm
            {...choice}
            key={j}
            index={j}
            removeChoice={this.removeChoice}
            questionIndex={index}
            initialValues={choice}
            isEditing={isEditing}
          />
        ))}
      </div>
    </form>);
  }
}

export default reduxForm({
  form: 'questionForm',
  fields: ['order', 'id', 'stem', 'choices[].id', 'choices[].stem', 'choices[].next_question_id']
})(QuestionForm);
