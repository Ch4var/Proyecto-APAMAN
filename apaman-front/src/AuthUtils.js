export const tieneRol = (rol) => {
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  return roles.some((r) => r.nombre === rol);
};

export const tieneAlgunRol = (rolesRequeridos) => {
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  return rolesRequeridos.some((rol) => roles.some((r) => r.nombre === rol));
};
