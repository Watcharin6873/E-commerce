import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listCategory } from "../api/Category";
import { listProduct, searchFilters } from "../api/Product";
import _ from 'lodash'

const ecomStore = (set, get) => ({
  user: null,
  token: null,
  categories: [],
  products: [],
  carts: [],
  actionAddToCart: (product) => {
    const carts = get().carts
    const updateCart = [...carts, { ...product, count: 1 }]

    //Step Unique
    const unique = _.unionWith(updateCart, _.isEqual)
    set({ carts: unique })


  },
  actionUpdateQuantity: (productId, newQuantity) => {
    // console.log('Update Click', productId, newQuantity)
    set((state) => ({
      carts: state.carts.map((item) =>
        item.p_id === productId
          ? { ...item, count: Math.max(1, newQuantity) }
          : item
      )
    }))
  },
  actionRemoveProduct: (productId)=>{
    // console.log('Remove Product', productId)
    set((state)=>({
      carts: state.carts.filter((item)=>
        item.p_id !== productId
      )
    }))
  },
  getTotalPrice:()=>{
    return get().carts.reduce((total, item)=>{
      return total + item.price * item.count
    }, 0)
  },

  actionLogin: async (form) => {
    const res = await axios.post('http://localhost:5000/api/asset/login', form)
    set({
      user: res.data.payload,
      token: res.data.token
    })
    return res
  },
  getCategory: async () => {
    try {
      const res = await listCategory()
      set({ categories: res.data })
    } catch (err) {
      console.log(err)
    }
  },
  getProducts: async (count) => {
    try {
      const res = await listProduct(count)
      set({ products: res.data })
    } catch (err) {
      console.log(err)
    }
  },
  actionSearchFilter: async (arg) => {
    try {
      const res = await searchFilters(arg)
      set({ products: res.data })
    } catch (err) {
      console.log(err)
    }
  },
})

const usePersist = {
  name: 'ecom-store',
  storage: createJSONStorage(() => localStorage)
}

const useEcomStore = create(persist(ecomStore, usePersist))

export default useEcomStore