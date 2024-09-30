import { History } from "../models/history.model.js";

export const deviceAllHistory = async (req, res) => {
  const { deviceId } = req.params;
  try {
    const deviceHistoryData = await History.find({ deviceId });
    if (!deviceHistoryData) {
      return res.status(404).json({
        message: "No Device Found",
        success: false,
      });
    }
    return res.status(201).json({
      message: "See your device history ever",
      success: true,
      deviceHistoryData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error find device",
      error: error.message,
    });
  }
};

export const deviceTripsWithRoute = async (req, res) => {
  const { deviceId, from, to } = req.query;
  //   console.log("query parameters", deviceId, from, to);
  const formattedFromDateStr = from.replace(" ", "+"); // '2024-09-24T00:41:17.000+00:00'
  const formattedToDateStr = to.replace(" ", "+"); // '2024-09-24T00:41:17.000+00:00'
  //   console.log("CCCCC",formattedToDateStr)
  try {
    const deviceDataByDateRange = await History.find({
      deviceId,
      deviceTime: {
        $gte: formattedFromDateStr, // From date (greater than or equal)
        $lte: formattedToDateStr, // To date (less than or equal)
      },
    });
    // console.log("devicce data", deviceDataByDateRange.length);
    if (deviceDataByDateRange.length === 0) {
      return res.status(404).json({
        message: "No Trip Found",
        success: false,
      });
    }
    const deviceDataByTrips = [];
    let ignitionOnValue = [];

    for (const ignitiontrue of deviceDataByDateRange) {
      if (ignitiontrue.attributes.ignition === false) {
        if (ignitionOnValue.length > 0) {
          deviceDataByTrips.push([...ignitionOnValue]);
          ignitionOnValue = [];
        }
      } else if (ignitiontrue.attributes.ignition === true) {
        ignitionOnValue.push(ignitiontrue);
      }
    }
    if (ignitionOnValue.length > 0) {
      deviceDataByTrips.push([...ignitionOnValue]);
    }
    // console.log("Grouped trips: ", deviceDataByTrips);

    return res.status(201).json({
      message: "See your device trips",
      success: true,
      deviceDataByTrips,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

export const showOnlyDeviceTripStartingPointAndEndingPoint = async (
  req,
  res
) => {
  const { deviceId, from, to } = req.query;
  const formattedFromDateStr = from.replace(" ", "+");
  const formattedToDateStr = to.replace(" ", "+"); 
  try {
    const deviceDataByDateRange = await History.find({
      deviceId,
      deviceTime: {
        $gte: formattedFromDateStr, // From date (greater than or equal)
        $lte: formattedToDateStr, // To date (less than or equal)
      },
    });
    if (deviceDataByDateRange.length === 0) {
      return res.status(404).json({
        message: "No Trip Found",
        success: false,
      });
    }
    const deviceDataByTrips = [];
    let ignitionOnValue = [];

    for (const ignitiontrue of deviceDataByDateRange) {
      if (ignitiontrue.attributes.ignition === false) {
        if (ignitionOnValue.length > 0) {
          deviceDataByTrips.push([...ignitionOnValue]);
          ignitionOnValue = [];
        }
      } else if (ignitiontrue.attributes.ignition === true) {
        ignitionOnValue.push(ignitiontrue);
      }
    }
    if (ignitionOnValue.length > 0) {
      deviceDataByTrips.push([...ignitionOnValue]);
    }
    const finalTrip = [];
    for (const index of deviceDataByTrips) {
      const speed = [];
      for (const element of index) {
        speed.push(element.speed);
      }
      const maxSpeed = Math.max(...speed);
      const avgSpeed =
        speed.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        ) / speed.length;

        // here i am calculating AVG Time
        const startTime = index[0].deviceTime;
        const endTime = index.length > 1 ? index[index.length - 1].deviceTime : "Running"
        const start = new Date(startTime);
        const end = new Date(endTime);
        const totalTimeMillis = end - start; 
        const totalMinutes = Math.floor(totalTimeMillis / (1000 * 60));
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        const duration = `${totalHours}h ${remainingMinutes}m`;
      // Create a new object to hold only the required fields
      const arrivalElement = {
        deviceId: index[0].deviceId,
        startTime: index[0].deviceTime, 
        maxSpeed: maxSpeed,
        avgSpeed: avgSpeed,
        duration:duration,
        startLongitude: index[0].longitude,
        startLatitude: index[0].latitude,
        totalDistance: index[0].attributes.totalDistance,
        endLongitude:index.length > 1 ? index[index.length - 1].longitude : "Running",
        endLatitude:index.length > 1 ? index[index.length - 1].latitude : "Running",
        endTime:index.length > 1 ? index[index.length - 1].deviceTime : "Running",         
      };
      // Update the first object in the index
      finalTrip.push(arrivalElement);
    }

    return res.status(201).json({
      message: "See your device trips",
      success: true,
      finalTrip,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

export const deviceStopage = async (req, res) => {
  const { deviceId, from, to } = req.query;
  //   console.log("query parameters", deviceId, from, to);
  const formattedFromDateStr = from.replace(" ", "+"); // '2024-09-24T00:41:17.000+00:00'
  const formattedToDateStr = to.replace(" ", "+"); // '2024-09-24T00:41:17.000+00:00'
  //   console.log("CCCCC",formattedToDateStr)
  try {
    const deviceDataByDateRange = await History.find({
      deviceId,
      deviceTime: {
        $gte: formattedFromDateStr, // From date (greater than or equal)
        $lte: formattedToDateStr, // To date (less than or equal)
      },
    });
    // console.log("devicce data", deviceDataByDateRange.length);
    if (deviceDataByDateRange.length === 0) {
      return res.status(404).json({
        message: "No Stopage Found",
        success: false,
      });
    }
    const deviceDataByStopage = [];
    let ignitionOffValue = [];

    for (const ignitionFalse of deviceDataByDateRange) {
      if (ignitionFalse.attributes.ignition === true) {
        if (ignitionOffValue.length > 0) {
          deviceDataByStopage.push([...ignitionOffValue]);
          ignitionOffValue = [];
        }
      } else if (ignitionFalse.attributes.ignition === false) {
        ignitionOffValue.push(ignitionFalse);
      }
    }
    if (ignitionOffValue.length > 0) {
      deviceDataByStopage.push([...ignitionOffValue]);
    }
    // console.log("Grouped trips: ", deviceDataByTrips);

    const finalDeviceDataByStopage = [];
    for (const index of deviceDataByStopage) {
      // Create a new object to hold only the required fields
      const arrivalElement = {
        // _id: index[0]._id,
        speed: index[0].speed,
        ignition: index[0].attributes.ignition,
        longitude: index[0].longitude,
        latitude: index[0].latitude,
        course: index[0].course,
        deviceId: index[0].deviceId,
        distance: index[0].distance,
        totalDistance: index[0].totalDistance,
        arrivalTime: index[0].deviceTime, // Set arrivalTime
        departureTime:
          index.length > 1 ? index[index.length - 1].deviceTime : "Stop", // Set departureTime if exists
        // deviceTime: index[0].deviceTime,
        // createdAt: index[0].createdAt,
        // updatedAt: index[0].updatedAt,
        // __v: index[0].__v,
      };

      // Update the first object in the index
      index[0] = arrivalElement;
      finalDeviceDataByStopage.push(arrivalElement);

      // Log the updated object
      // console.log("Updated array", index[0]);
    }

    return res.status(201).json({
      message: "See your device trips",
      success: true,
      finalDeviceDataByStopage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};
