/**
 * Adapter to fetch a list of entities from a given service.
 */
export async function fetchEntityCollection ({
  service,
  payload = {},
  apiKey = '',
  settings = {},
}) {
  const {
    query = {},
    queryselector = 'all',
    exclude_status = 'deleted',
    page = 1,
    pageSize = 10,
  } = payload;

  try {
    return await new service({ apiKey, settings }).getByParameters({
      queryselector,
      exclude_status,
      search: query.search || '',
      page,
      pageSize,
    });
  } catch (error) {
    console.error('[fetchEntityCollection] Error loading entities', error);
    return null;
  }
}

/**
 * Fetches multiple collections in parallel using service and payload.
 *
 * Example:
 * const [certifications, statuses] = await fetchMultipleEntities([
 *   { service: CertificationService, payload: { selector: 'all', ... } },
 *   { service: CertificationService, payload: { selector: 'statuses', ... } }
 * ]);
 *
 * @param {Array<{ service: any, payload: object }>} list
 * @returns {Promise<Array>} results in same order
 */
export async function fetchMultipleEntities (list = []) {
  return Promise.all(
    list.map(({ service, payload }) => fetchEntityCollection({ service, payload }))
  );
}

/**
 * Adapter to update an existing entity using a given service.
 */
export async function updateEntityRecord ({ service, payload }) {
  try {
    if (payload._id) delete payload._id;
    return await new service().update(payload);
  } catch (error) {
    console.error('[updateEntityRecord] Error updating entity', error);
    return null;
  }
}

/**
 * Adapter to create a new entity using a given service.
 */
export async function createEntityRecord ({ service, payload }) {
  try {
    return await new service().create(payload);
  } catch (error) {
    console.error('[createEntityRecord] Error creating entity', error);
    return null;
  }
}
