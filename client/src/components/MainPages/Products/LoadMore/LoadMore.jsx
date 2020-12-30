import { useContext } from 'react';
import { GlobalState } from '../../../../globalstate';

const LoadMore = () => {
  const state = useContext(GlobalState);
  const [page, setPage] = state.productsAPI.page;
  const [result] = state.productsAPI.result;
  return (
    <div className='load_more'>
      {result < page * 20 ? (
        ''
      ) : (
        <button onClick={() => setPage(page + 1)}>Load More</button>
      )}
    </div>
  );
};

export default LoadMore;
