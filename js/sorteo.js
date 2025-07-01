document.addEventListener('DOMContentLoaded', function () {
  const imagenesSorteo = [
    'assets/img/autos/auto1.jpg',
    'assets/img/autos/auto2.jpg',
    'assets/img/autos/auto3.jpg'
  ];
  let idxSorteo = 0;
  const img = document.getElementById('img-sorteo');
  if (!img) return;
  setInterval(() => {
    idxSorteo = (idxSorteo + 1) % imagenesSorteo.length;
    img.src = imagenesSorteo[idxSorteo];
  }, 2500);
});