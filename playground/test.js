if (isKeyed !== (array[i] != null && array[i].key != null)) {
  throw new TypeError(
    isKeyed && (array[i] != null || typeof array[i] === "boolean")
      ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole."
      : "In fragments, vnodes must either all have keys or none have keys."
  )
}
