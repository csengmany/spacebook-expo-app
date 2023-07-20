import { useEffect, useState } from "react";
import {FlatList, StyleSheet, View } from "react-native";
import axios from "axios";
import Loader from "../components/Loader";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import Office from "../components/Office";

export default function HomeScreen() {
  const [data, setData] = useState([])
  const [searchFilters, setSearchFilters] = useState('')
  const [filters, setFilters] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  //default min and max range values
  const [priceValues,setPriceValues] = useState([null,null])
  const [surfaceValues,setSurfaceValues] = useState([null,null])
  //state for paging
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [maxPage, setMaxPage] = useState("")

  //state for date
  const[date, setDate] = useState(null)

const [loadedOffices, setLoadedOffices] = useState([]);
const loadMoreOffices = () => {
  //check if no need to load more
  if(loadMoreOffices.length===data.count)
  return
  //change limit to load more
  setLimit(limit+12)
};
const handleEndReached = () => {
  loadMoreOffices();
};

  const server = "http://192.168.68.104:3002"
  //"https://spacebook-backend-94816fa1b759.herokuapp.com"

  useEffect(() => {
  //axios request
  const fetchData = async () => {
    try {
      const response = await axios.get(`${server}/offices?${searchFilters}&${filters}&page=${page}&limit=${limit}`)
      if(response){
        setData(response.data)
        setLoadedOffices(response.data.offices)
         //set max min value for price and surface using in SelectRange component
        setPriceValues([response.data.minPrice.price, response.data.maxPrice.price])
        setSurfaceValues([response.data.minSurface.surface,response.data.maxSurface.surface])
        setIsLoading(false)
        setMaxPage(Math.ceil(response.data.count / limit))
      }
    } catch (error) {
      console.log(error.response)
    }
  }
  fetchData()
}, [ searchFilters, filters, page, setPage, limit ])

  return ( 
    isLoading?  <Loader />
    :
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar searchFilters={searchFilters} 
          setSearchFilters={setSearchFilters} 
          filters={filters} 
          setFilters={setFilters} 
          priceValues={priceValues} 
          surfaceValues={surfaceValues}
        />
        <Filters 
          setPage={setPage}
          setFilters={setFilters} 
          searchFilters={searchFilters}
          priceValues={priceValues}
          surfaceValues={surfaceValues}
          />
      </View>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={loadedOffices}
        renderItem={({ item }) => <Office office={item}/>}
        keyExtractor={(item) => item._id}
        onEndReached={handleEndReached} //call function to load more offices
        onEndReachedThreshold={1.5} //load more offices before reaching the last office
      />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  }
}); 