import AppModel from '../../../../../../../s3d/scripts/modules/app/app.model';
async function fetchAndProcessData() {
  return;
  const id = 123; // Replace with actual ID

  try {
    const data = await AppModel.asyncGetConstructionProgressItemById(id);
    console.log('Construction Progress Data:', data);
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

fetchAndProcessData();
