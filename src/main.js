Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      description: "A pair of warm, fuzzy socks",
      selectedVariant: 0,
      altText: "A pair of socks",
      link: "https://www.vuemastery.com/",
      onSale: true,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "hsl(148, 57%, 36%)",
          variantImage:
            "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
          variantQuantity: 12,
        },
        {
          variantId: 2235,
          variantColor: "hsl(215, 31%, 25%)",
          variantImage:
            "https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg",
          variantQuantity: 4,
        },
      ],
      sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    };
  },

  created() {},

  updated() {},

  methods: {
    addToCart() {
      this.variants[this.selectedVariant].variantQuantity--;
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.variants[this.selectedVariant].variantQuantity++;
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
  },

  computed: {
    title() {
      return `${this.brand} ${this.product}`;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity > 0;
    },
    selectedQuantity() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      return this.premium ? "Free" : "2.99";
    },
  },

  template: `
  <div class="product">

    <div class="product-image">
      <img :src="image" :alt="altText" />
    </div>

    <div class="product-info">
      <h1>{{ title }}</h1>
      <span v-show="onSale">On Sale!</span>

      <p :class="[!inStock ? 'outOfStock' : '']">
        {{ selectedQuantity }} &mdash;
        <span v-if="inStock">In Stock</span>
        <span v-else>Out of Stock</span>
      </p>
      <p>Shipping: {{ shipping }}</p>
      <p>{{ description }}</p>
       <br>
      <a :href="link">More info</a>
        <br>
      <ul>
        <li v-for="detail in details">• {{ detail }}</li>
      </ul>
        <br>
<div class="color-size">
      <div class="colors">
      <b class="color-title">Colors:</b>
        <span class="color-box" v-for="(variant, index) in variants" :key="variant.variantId" :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
        </span>
      </div>
            <div class="sizes">
        <b>Sizes:</b>
        <select>
          <option v-for="size in sizes">{{ size }}</option>
        </select>
      </div></div>
        <br>
        <div class="buttons">
            <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
            <button @click="removeFromCart" :disabled="!inStock" :class="{ disabledButton: inStock }">Remove from cart</button></div>
        </div>
  </div>
  `,
});

const app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCartAdd(id) {
      this.cart.push(id);
    },
    updateCartRemove(id) {
      this.cart.pop(id);
    },
    resetCart() {
      this.cart = [];
    },
  },
});
