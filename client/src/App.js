import axios from 'axios';
import { useState, useEffect } from 'react';

import ProductWidget from './Components/ProductWidget/ProductWidget.js';
import RatingsAndReviews from './Components/RatingsAndReviews/RatingsAndReviews.js';
import QuestionsAndAnswers from './Components/QuestionsAndAnswers/QuestionsAndAnswers.js';
import NavBar from './Components/NavBar/NavBar.js';
import Modal from './Components/Modal/Modal.js';

function App() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [modal, setModal] = useState(<></>);

  let setShowModal = (comp, content) => {
    setModal(<Modal serve={comp} content={content} setModal={setModal}/>);
  }

  useEffect(() => {
    axios
      .get("http://localhost:8080/products")
      .then((res) => {
        // console.log(res);
        const clothing = res.data;

        setProducts(clothing);
        const random = Math.floor(Math.random() * clothing.length);
        setProduct(clothing[random]);
        // console.log("product is ", clothing[random]);
        axios
          .get("http://localhost:8080/qa/questions?product_id=" + clothing[random].id)
          .then((res) => {
            setQuestionsAndAnswers(res.data.results);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChangeProduct = () => {
    const random = Math.floor(Math.random() * products.length);
    setProduct(products[random]);

    axios
      .get("http://localhost:8080/qa/questions?product_id=" + products[random].id)
      .then((res) => {
        setQuestionsAndAnswers(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {modal}
      <NavBar changeProduct={handleChangeProduct}/>
      <ProductWidget product={product} />
      <QuestionsAndAnswers product={product} />
      <RatingsAndReviews product={product} setShowModal={setShowModal}/>
      <p className="accentColor">Current Product is {JSON.stringify(product)}</p>
    </>
  );
}

export default App;
