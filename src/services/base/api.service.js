import axios from 'axios';

export default class BaseApi {
  constructor () {
    this.api_key = null;
    this.client = null;
    this.serviceEndpoints = {
      baseUrlProd: process.env.VERIPASS_SERVICE_URL,
      baseUrlDev: process.env.VERIPASS_DEV_SERVICE_URL,
      get: '',
      create: '',
      update: '',
      delete: '',
      patch: '',
      put: '',
    };
  }

  /**
   * Initializes and returns an Axios client instance with the necessary headers and configurations.
   *
   * @returns {Object} Axios client instance.
   */
  request () {
    let headers = {
      Accept: 'application/json',
    };

    if (this.api_key) {
      headers['api-key'] = this.api_key;
    }

    this.client = axios.create({
      baseURL: this.api_url,
      timeout: 31000,
      headers: headers,
    });

    return this.client;
  }

  /**
   * Serializes a nested object into a query string format.
   *
   * @param {Object} obj The object to be serialized.
   * @param {string} [prefix] Prefix for nested properties in the object.
   * @returns {string} Serialized query string.
   */
  serializerOjectToQueryString (obj, prefix) {
    if (obj && typeof obj === 'object') {
      const serializedArr = [];
      let key = {};

      for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const k = prefix ? prefix + '[' + key + ']' : key;
          const value = obj[key] || null;
          serializedArr.push(
            value !== null && typeof value === 'object'
              ? this.serializerOjectToQueryString(value, k)
              : encodeURIComponent(k) + '=' + encodeURIComponent(value),
          );
        }
      }
      return serializedArr.join('&');
    }
  }

  /**
   * Converts an object into a query string format.
   *
   * @param {Object} obj The object to be converted.
   * @returns {string} Query string starting with '?' or an empty string if the object is not valid.
   */
  objectToQueryString (obj) {
    if (obj && typeof obj === 'object') {
      const result = this.serializerOjectToQueryString(obj);
      return `?${result}`;
    } else {
      return '';
    }
  }

  /**
   * Execute a query to filter by parameters
   * @param {Object} data Provides all information to get an entity by parameters
   * @param {string} data.queryselector Is the selector of filter
   * @returns an object to be processed
   */
  async getByParameters (data) {
    try {
      if (!data) {
        return null;
      }

      if (!data.queryselector) {
        console.error('Provide a query selector to query');
        return null;
      }

      const parameters = this.objectToQueryString(data);
      const url = `${this.serviceEndpoints.baseUrl}${this.serviceEndpoints.get}${data.queryselector}${parameters}`;

      const result = await this.request().get(url);

      return result.data;
    } catch (error) {
      console.error(error);
      return error.body;
    }
  }

  /**
   * Execute a create query into backend service
   * @param {*} payload
   * @returns
   */
  async create (payload) {
    try {
      if (!payload) {
        return null;
      }

      const result = await this.request().post(
        `${this.serviceEndpoints.baseUrl}${this.serviceEndpoints.create}`,
        payload,
      );

      return result.data;
    } catch (error) {
      console.error(error.response.data);
      return error.response.data || null;
    }
  }

  /**
   * Execute an update query into backend service
   * @param {*} payload
   * @returns
   */
  async update (payload) {
    try {
      if (!payload) {
        return null;
      }

      const result = await this.request().patch(
        `${this.serviceEndpoints.baseUrl}${this.serviceEndpoints.update}`,
        payload,
      );

      return result.data;
    } catch (error) {
      console.error(error);
      return error.body;
    }
  }

  /**
   * Execute a delete query into backend service
   * @param {*} payload
   * @returns
   */
  async delete (payload) {
    try {
      if (!payload) {
        return null;
      }

      const result = await this.request().delete(
        `${this.serviceEndpoints.baseUrl}${this.serviceEndpoints.delete}`,
        {
          data: payload,
        },
      );

      return result.data;
    } catch (error) {
      console.error(error);
      return error.body;
    }
  }

  /**
   * Execute a post query
   * @param {*} payload Define what data need to be posted
   * @param {*} settings Configuration settings for the request
   * @returns
   */
  async post (payload, settings) {
    try {
      if (!payload) {
        return null;
      }
      
      const endpoint = `${settings?.debug
        ? this.serviceEndpoints.baseUrlDev
        : this.serviceEndpoints.baseUrlProd}${settings?.endpoint || this.serviceEndpoints.post}`
      const result = await this.request().post(endpoint, payload);
      
      return result.data;
    } catch (error) {
      console.error(error);
      return error.response.data;
    }
  }

  /**
   * Execute a put query
   * @param {*} payload Define what data need to be posted
   * @param {*} settings Configuration settings for the request
   * @returns
   */

  async put (payload, settings) {
    try {
      if (!payload) {
        return null;
      }

      const result = await this.request().put(
        `${this.serviceEndpoints.baseUrl}${settings?.endpoint || this.serviceEndpoints.put}`,
        payload,
      );

      return result.data;
    } catch (error) {
      console.error(error);
      return error.response.data;
    }
  }

  /**
   * Execute a patch query
   * @param {*} payload Define what data need to be posted
   * @param {*} settings Configuration settings for the request
   * @returns
   */
  async patch (payload, settings) {
    try {
      if (!payload) {
        return null;
      }

      const result = await this.request().patch(
        `${this.serviceEndpoints.baseUrl}${settings?.endpoint || this.serviceEndpoints.patch}`,
        payload,
      );

      return result.data;
    } catch (error) {
      console.error(error);
      return error.response.data;
    }
  }

  /**
   * Execute a query get query
   * @param {*} payload
   * @param {*} endpoint
   * @returns
   */
  async get (payload, endpoint) {
    try {
      if (!payload) {
        return null;
      }

      const parameters = this.objectToQueryString(payload);

      const result = await this.request().get(
        `${this.serviceEndpoints.baseUrl}${endpoint}${parameters}`,
      );

      return result.data;
    } catch (error) {
      console.error(error);
      return error.body;
    }
  }
}
