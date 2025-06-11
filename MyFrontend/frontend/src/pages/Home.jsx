import ProductsCarts from "../components/ProductsCarts"; 

const Home = () => {
  return (
    <>
      <h3 className="w-full font-bold text-left text-[24px] my-12">Welcome Racy World, </h3>

      <div className="grid grid-cols-4 gap-6">
        <ProductsCarts /> 
      </div>
    </>
  );
};

export default Home;
