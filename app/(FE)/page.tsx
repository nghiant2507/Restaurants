import { redirect } from 'next/navigation';

const Home = () => {
  return redirect('/restaurants');
};

export default Home;
