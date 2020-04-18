let eventBus = new Vue();

Vue.component("product-review", {
  template: `
  <div class="form-rev">
  <h2>Make a Review</h2>
  <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
      <b>Please correct the following errors:</b>
      <ul>
        <li v-for="error in errors">{{ error }}
        </li>
      </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input style="width: 100%" id="name" v-model="name" required>
    </p>
    <p class="review-textarea">
      <label for="review">Review:</label>
      <textarea id="review" v-model="review" required></textarea>
    </p>
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating" required>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </select>
    </p>
    <!-- <p class="rating-reco">
      <label for="recommend">Would you reccomend this product?:</label>
    <div class="reco-btns">
      <span class="reco-btn" style="margin: 0 1rem"> Yes <input type="radio" value="Yes" v-model="recommend" />
      </span>
      <span class="reco-btn" style="margin: 0 1rem"> No <input type="radio" value="No" v-model="recommend" />
      </span>
    </div>
    </p> -->

    <input type="submit" class="review-btn" value="Submit">

  </form>
  </div>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if (!this.name) {
          this.errors.push("Name required.");
        }
        if (!this.review) {
          this.errors.push("Review required.");
        }
        if (!this.rating) {
          this.errors.push("Rating required.");
        }
      }
    },
  },
});

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
      reviews: [],
    };
  },

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
    mounted() {
      eventBus.$on("review-submitted", (productReview) => {
        this.reviews.push(productReview);
      });
    },
  },

  template: `
<div class="product">
  <div class="product-image">
    <img style="max-width: 320px;" :src="image" :alt="altText" />
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
    <a :href="link">More info</a>
    <ul>
      <li v-for="detail in details">• {{ detail }}</li>
    </ul>
    <div class="color-size">
      <div class="colors">
        <b class="color-title">Colors:</b>
        <span
          class="color-box"
          v-for="(variant, index) in variants"
          :key="variant.variantId"
          :style="{ backgroundColor: variant.variantColor }"
          @mouseover="updateProduct(index)"
        >
        </span>
      </div>
      <div class="sizes">
        <b>Sizes:</b>
        <select>
          <option v-for="size in sizes">{{ size }}</option>
        </select>
      </div>
    </div>
    <div class="buttons">
      <button
        @click="addToCart"
        :disabled="!inStock"
        :class="{ disabledButton: !inStock }"
      >
        Add to cart
      </button>
      <button
        @click="removeFromCart"
        :disabled="inStock"
        :class="{ disabledButton: inStock }"
      >
        Remove from cart
      </button>
    </div>
  </div>

  <product-tabs :reviews="reviews"></product-tabs>
</div>

  `,
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
<div>
  <span
    class="tab"
    :class="{ activeTab: selectedTab === tab}"
    v-for="(tab, index) in tabs"
    :key="index"
    @click="selectedTab = tab"
  >
    {{ tab }}
  </span>

<div v-show="selectedTab === 'Reviews'" class="reviews-list">
  <h2>Reviews</h2>
  <p v-if="!reviews.length">There are no reviews yet.</p>
  <ul>
    <li v-for="review in reviews">
      <p><b>Name: </b>{{ review.name }}</p>
      <p><b>Rating: </b>{{ review.rating }}</p>
      <p style="margin-bottom: 1rem"><b>Review: </b>{{ review.review }}</p>
    </li>
  </ul>
</div>

<product-review
  v-show="selectedTab === 'Make a Review'"
></product-review>

</div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    };
  },
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
