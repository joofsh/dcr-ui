import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  LoadingSpinner,
  ResourceRow,
  ResourceMap,
  MaxHeightContainer,
  SearchBar
} from 'src/components';

import { collectionFilter } from 'src/reducers/search';

function fetchResources() {
  return {
    type: 'CALL_API',
    method: 'get',
    url: '/api/resources',
    params: { length: 10000 },
    successType: 'RECEIVE_RESOURCES_SUCCESS'
  };
}

export class Resources extends Component {
  static fetchData({ store }) {
    return store.dispatch(fetchResources());
  }

  static propTypes = {
    fetchResources: PropTypes.func.isRequired,
    resources: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    params: PropTypes.object,
    children: PropTypes.node
  };

  componentDidMount() {
    this.props.fetchResources();
  }

  render() {
    let {
      resources,
      children,
      params: {
        id: activeResourceId
      }
    } = this.props;
    let resourceContent;

    if (this.props.isFetching) {
      resourceContent = <LoadingSpinner large absolute center/>;
    } else {
      resourceContent = (<div>
        <SearchBar
          name="resourceFilter"
          placeholder="Find a Resource..."
        />
        <div className="list-group resource-list">
          {resources.map((resource, i) => (
            <ResourceRow key={i} {...resource} />
          ))}
        </div>
      </div>);
    }

    require('./Resources.scss');
    return (<div className="container-fluid container-resources">
      <div className="row">
        <MaxHeightContainer className="col-md-6 col-xs-12 pull-right">
          { children || resourceContent }
        </MaxHeightContainer>
        <MaxHeightContainer className="col-md-6 col-xs-12 resource-map-wrapper">
          <ResourceMap resources={resources} activeResourceId={+activeResourceId}/>
        </MaxHeightContainer>
      </div>
    </div>);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchResources: () => {
      dispatch((dispatch, getState) => {
        if (getState().resource.resources.length) {
          return;
        }

        dispatch({ type: 'REQUEST_RESOURCES' });
        dispatch(fetchResources());
      });
    }
  };
}

function mapStateToProps(state) {
  let resources = collectionFilter(state.resource.resources,
                                   state.search.resourceFilter,
                                  ['id', 'title', 'tags']);
  return {
    resources,
    isFetching: state.resource.isFetching
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Resources);
