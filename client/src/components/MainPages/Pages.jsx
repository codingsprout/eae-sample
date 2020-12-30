import { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { GlobalState } from '../../globalstate';
import NotFound from '../../Utils/NotFound';
import {
  Products,
  Login,
  Register,
  ProductDetail,
  Categories,
  CreateProduct,
} from '../MainPages';

const Pages = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  return (
    <Switch>
      <Route path='/' exact component={Products} />
      <Route path='/detail/:id' exact component={ProductDetail} />

      <Route path='/login' exact component={isLogged ? NotFound : Login} />

      <Route
        path='/register'
        exact
        component={isLogged ? NotFound : Register}
      />

      <Route
        path='/category'
        exact
        component={isAdmin ? Categories : NotFound}
      />

      <Route
        path='/create_product'
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />

      <Route
        path='/edit_product/:id'
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />

      <Route path='*' exact component={NotFound} />
    </Switch>
  );
};

export default Pages;
