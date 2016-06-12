import React from 'react';
import { IndexRoute, Route } from 'react-router';

import {
  App,
  Healthcheck,
  Home,
  Login,
  Users,
  User,
  NewUser,
  NewClient,
  NotFound,
  Resources,
  Resource,
  NewResource,
  QuestionWizard,
  PersonalizedResources,
  Questions
} from './containers';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/healthcheck" component={Healthcheck}/>

      <Route path="/clients/new" component={NewClient}/>
      <Route path="/clients/:id" component={User}/>
      <Route path="/clients/:id/questions" component={QuestionWizard}/>
      <Route path="/clients/:id/resources" component={PersonalizedResources}/>

      <Route path="/users" component={Users} />
      <Route path="/users/new" component={NewUser}/>
      <Route path="/users/:id" component={User}/>
      <Route path="/users" component={Users} />

      <Route path="/resources/new" component={NewResource}/>
      <Route path="/resources" component={Resources}>
        <Route path="/resources/:id" component={Resource}/>
      </Route>

      <Route path="/questions" component={Questions}/>

      <Route path="/wizard" component={QuestionWizard}/>
      <Route path="/my_resources" component={PersonalizedResources}/>

      <Route path="*" component={NotFound}/>
    </Route>
  );
};
