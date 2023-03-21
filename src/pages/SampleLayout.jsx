import React, { useState, useEffect } from 'react';
//import Animal from './animal';
import './css/SampleLayout.css'
import { API_KEY, CLIENT_SECRET } from './apiKeys';



export default function SampleLayout() {
  const [accessToken, setToken] = useState();
  const [pets, setPets] = useState([]);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [prevUrl, setPrevUrl] = useState('');
  const [nextUrl, setNextUrl] = useState('');  
  const [formData, setFormData] = useState({
    animal: "dog",
    zip: "",
    goodWithChildren: "",
    goodWitDogs: "",
    goodWitCats: "",
    houseTrained: "",
    male: "",
    female: "",
    small: "",
    medium: "",
    large: "",
    xlarge: ""
  });


  //Get the AccessToken in the beginning.
  useEffect(() => {
    let apiUrl = 'https://api.petfinder.com/v2/oauth2/token';
    fetch(apiUrl, {
      method: 'POST',
      body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${CLIENT_SECRET}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (resp) {
      return resp.json();
    }).then(function (data) {
      setToken(`${data.token_type} ${data.access_token}`);
    });
  }, []);

  function getPets(url) {
    fetch(url, {
      headers: {
        'Authorization': accessToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => response.json())
      //.then(data => data.animals.filter(animal => animal.hasOwnProperty('photos') && animal.photos.length > 0))
      .then((data) => {
        setPets(data.animals);
        data?.pagination?._links.next ? setShowNext(true) : setShowNext(false);
        setNextUrl(showNext ? data.pagination._links.next.href : '');

        data?.pagination?._links.previous ? setShowPrev(true) : setShowPrev(false);
        setPrevUrl(showPrev ? data.pagination._links.previous.href : '');

        console.log(data);

      })
      .catch((error) => console.error(error));;
  }


  function handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value
    });
  }


  function setFormDataFromDB() {
    setFormData();

  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    setPets(getPets(`https://api.petfinder.com/v2/animals?${buildQueryStringForAPICall()}`));
  }

  const handlePrev = (event) => {
    event.preventDefault();    
    setPets(getPets(`https://api.petfinder.com${prevUrl}`));
  }

  const handleNext = (event) => {
    event.preventDefault();    
    setPets(getPets(`https://api.petfinder.com${nextUrl}`));
  }

  // =================================================
  // this component builds the main part of the screen
  // button onClick build the search criteria.
  // =================================================
  return (
    <>
      <meta charSet="UTF-8" />
      <title>Find A Pet</title>
      <div id="wrapper">
        <div id="header">
          <h1>Animal Adoption App</h1>
        </div>
        <div id="sidebar">
          <form onSubmit={handleSubmit}>
            <h3>CATEGORIES</h3>
            <div className="checklist categories">
              <select id="animal" name="animal" value={formData.animal} onChange={handleChange} >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="rabbit">Rabbit</option>
                <option value="bird">Bird</option>
                <option value="barnyard">Barnyard</option>
              </select>
            </div>
            <h3>Zip Code</h3>
            <div>
              <input type="text" id="zip" maxLength="5" size="5" name='zip' onChange={handleChange} required />
            </div>
            <h3>Temperament</h3>
            <div className="checklist colors">
              <ul>
                <li>
                  <input type="checkbox" id="goodWithChildren" name="goodWithChildren" onChange={handleChange} />
                  <label htmlFor="goodWithChildren"> Good with children </label>
                </li>
                <li>
                  <input type="checkbox" id="goodWitDogs" name="goodWitDogs" onChange={handleChange} />
                  <label htmlFor="goodWitDogs"> Good with dogs </label>
                </li>
                <li>
                  <input type="checkbox" id="goodWitCats" name="goodWitCats" onChange={handleChange} />
                  <label htmlFor="goodWitCats"> Good with cats </label>
                </li>
                <li>
                  <input type="checkbox" id="houseTrained" name="houseTrained" onChange={handleChange} />
                  <label htmlFor="houseTrained"> House trained </label>
                </li>
              </ul>
            </div>
            <h3>Gender</h3>
            <div className="checklist colors">
              <ul>
                <li>
                  <input type="checkbox" id="male" name="male" value="male" onChange={handleChange} />
                  <label htmlFor="male" > Male </label>
                </li>
                <li>
                  <input type="checkbox" id="female" name="female" value="female" onChange={handleChange} />
                  <label htmlFor="female" > Female </label>
                </li>
              </ul>
            </div>
            <h3>Size</h3>
            <div className="checklist colors">
              <ul>
                <li>
                  <input type="checkbox" id="small" name="small" value="small" title="small" onChange={handleChange} />
                  <label htmlFor="small" className=""> Small</label>
                </li>
                <li>
                  <input type="checkbox" id="medium" name="medium" value="medium" onChange={handleChange} />
                  <label htmlFor="medium" className=""> Medium</label>
                </li>
                <li>
                  <input type="checkbox" id="large" name="large" value="large" onChange={handleChange} />
                  <label htmlFor="large" className=""> Large</label>
                </li>
                <li>
                  <input type="checkbox" id="xlarge" name="xlarge" value="xlarge" onChange={handleChange} />
                  <label htmlFor="xlarge" className=""> Xlarge</label>
                </li>
              </ul>
            </div>
            <button type="submit" value="Search" id="search" >Search</button>


            <div style={{ padding: '20px 0' }}>

              {showPrev && <input type="button"  onClick={handlePrev} value="Prev" style={{ display: 'inline-block', width: '45%' }} />}
              {showNext && <input type="button"  onClick={handleNext} value="Next" style={{ display: 'inline-block', width: '45%', marginLeft: '5px' }} />}
              
            </div>

          </form>
        </div>

        <PetList items = {pets} />


        {/* {pets?.map((pet) => (
          <div key={pet.id}>
            <h2>{pet.name}</h2>
            <p>{pet.description}</p>
            <p>{JSON.stringify(pet)}</p>
            {pet.photos.length > 0 && pet.photos[0].small && (
              <img src={pet.photos[0].small} alt={pet.name} />
            )}
          </div>
        ))} */}



        {/* {newFunction()} */}
      </div>
      {/* <footer className="credit">
      </footer> */}
    </>
  )




  function buildQueryStringForAPICall() {

    let searchString = '';

    if (formData.animal.length > 0)
      searchString += `type=${formData.animal}`;

    if (formData.zip.length >= 0)
      searchString += `&location=${formData.zip}`;
    
    searchString += '&page=1';

    let genderCriteria = [];
    if (formData.male == true)
      genderCriteria.push('male');
    if (formData.female == true)
      genderCriteria.push('female');
    let genderCriteriaString = genderCriteria.join(',');
    if (genderCriteriaString.length > 0)
      searchString += `&gender=${genderCriteriaString}`;

    if (formData.goodWithChildren == true)
      searchString += '&good_with_children=true'

    if (formData.goodWitDogs == true)
      searchString += '&good_with_dogs=true'

    if (formData.goodWitCats == true)
      searchString += '&good_with_cats=true'

    if (formData.houseTrained == true)
      searchString += '&house_trained=true'

    let sizeCriteria = [];
    if (formData.small == true)
      sizeCriteria.push('small');
    if (formData.medium == true)
      sizeCriteria.push('medium');
    if (formData.large == true)
      sizeCriteria.push('large');
    if (formData.xlarge == true)
      sizeCriteria.push('xlarge');
    let sizeCriteriaString = sizeCriteria.join(',');
    if (sizeCriteriaString.length > 0)
      searchString += `&size=${sizeCriteriaString}`;

    return searchString;
  }
}

function PetList(props) {
 
    return (<div id="grid">
    {props.items?.map((pet) => (
      <div className="pet" key={pet.id} onClick={() => window.open(pet.url, "_blank")} style={{ cursor: "pointer" }} >
        <div className="make3D">
          <div className="pets-front">            

            {pet.photos.length > 0 && pet.photos[0].medium && (
              <img src={pet.photos[0].medium} alt='pet image' style={{ maxHeight: "315px", objectFit: "cover"}}  />
            )}
            <h2>{pet.name}</h2>           
            <p>{pet.description}</p>
          </div>
        </div>
      </div>
    ))}




  </div>);
}

//this.photo = animal.photos.length > 0 ? animal.photos[0].medium: "na.jpg";     

  // return <div id="grid">
  //   <div className="pet">
  //     <div className="make3D">
  //       <div className="pets-front">
  //         <img
  //           src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1.jpg"
  //           alt="" />
  //         <div className="stats">
  //           <div className="stats-container">
  //             <span className="pet_name">FLUTED HEM DRESS</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>;

