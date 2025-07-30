import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Stack,
  Box,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import HotelIcon from "@mui/icons-material/Hotel";
import { motion } from "framer-motion";

const floors = 10;
const roomsPerFloor = [10, 10, 10, 10, 10, 10, 10, 10, 10, 7];

const generateInitialRooms = () => {
  return Array.from({ length: floors }, (_, f) =>
    Array.from({ length: roomsPerFloor[f] }, (_, r) => ({
      id: `${f + 1}${String(r + 1).padStart(2, "0")}`,
      booked: false,
      floor: f + 1,
      index: r + 1,
    }))
  );
};

const travelFromStairs = (floor, index) => (floor - 1) * 2 + (index - 1);

export default function App() {
  const [rooms, setRooms] = useState(generateInitialRooms());
  const [numRooms, setNumRooms] = useState(1);
  const [travelTime, setTravelTime] = useState(null);
  const [lastBooked, setLastBooked] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

  useEffect(() => {
    const saved = localStorage.getItem("hotelRooms");
    if (saved) setRooms(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("hotelRooms", JSON.stringify(rooms));
  }, [rooms]);

  const resetBooking = () => {
    const fresh = generateInitialRooms();
    setRooms(fresh);
    setTravelTime(null);
    setLastBooked([]);
    setSnackbar({ open: true, message: "✅ Booking reset!", type: "info" });
  };

  const randomOccupancy = () => {
    const newRooms = generateInitialRooms().map((floor) =>
      floor.map((room) => ({ ...room, booked: Math.random() < 0.3 }))
    );
    setRooms(newRooms);
    setTravelTime(null);
    setLastBooked([]);
    setSnackbar({ open: true, message: "🎲 Random occupancy generated!", type: "info" });
  };

  const calcTravelTime = (combo) => {
    const sorted = [...combo].sort((a, b) =>
      a.floor === b.floor ? a.index - b.index : a.floor - b.floor
    );
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    return Math.abs(last.floor - first.floor) * 2 + Math.abs(last.index - first.index);
  };

  const getAllCombinations = (arr, k) => {
    if (k === 0) return [[]];
    if (arr.length === 0) return [];
    const [first, ...rest] = arr;
    const withFirst = getAllCombinations(rest, k - 1).map((c) => [first, ...c]);
    return [...withFirst, ...getAllCombinations(rest, k)];
  };

  const bookRooms = () => {
    if (numRooms < 1 || numRooms > 5) {
      setSnackbar({ open: true, message: "⚠ You can book 1-5 rooms only!", type: "warning" });
      return;
    }

    const available = rooms.flat().filter((room) => !room.booked);
    if (available.length < numRooms) {
      setSnackbar({ open: true, message: "❌ Not enough rooms available!", type: "error" });
      return;
    }

    const combos = getAllCombinations(available, numRooms);
    let best = null;
    let minTime = Infinity;

    combos.forEach((c) => {
      const t = calcTravelTime(c);
      if (t < minTime) {
        minTime = t;
        best = c;
      }
    });

    const updatedRooms = rooms.map((floor) =>
      floor.map((room) => (best.some((r) => r.id === room.id) ? { ...room, booked: true } : room))
    );

    setRooms(updatedRooms);
    setTravelTime(minTime);
    setLastBooked(best.map((r) => r.id));
    setSnackbar({ open: true, message: `✅ Rooms booked: ${best.map((r) => r.id).join(", ")}`, type: "success" });
  };

  const handleRoomClick = (room) => {
    if (room.booked) {
      setSnackbar({ open: true, message: `❌ Room ${room.id} is already booked! (Double-click to unbook)`, type: "warning" });
    } else {
      const updatedRooms = rooms.map((floor) =>
        floor.map((r) => (r.id === room.id ? { ...r, booked: true } : r))
      );
      setRooms(updatedRooms);
      setLastBooked([room.id]);
      setTravelTime(0);
      setSnackbar({ open: true, message: `✅ Room ${room.id} booked!`, type: "success" });
    }
  };

  const handleRoomDoubleClick = (room) => {
    if (!room.booked) return;
    const updatedRooms = rooms.map((floor) =>
      floor.map((r) => (r.id === room.id ? { ...r, booked: false } : r))
    );
    setRooms(updatedRooms);
    setLastBooked([]);
    setSnackbar({ open: true, message: `🗑 Room ${room.id} unbooked!`, type: "info" });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <HotelIcon sx={{ mr: 1 }} />
          <Typography variant="h6">RoomEase - Smart Room Booking</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <TextField
                label="Number of Rooms"
                type="number"
                size="small"
                value={numRooms}
                onChange={(e) => setNumRooms(Number(e.target.value))}
                inputProps={{ min: 1, max: 5 }}
              />
              <Button variant="contained" onClick={bookRooms}>Book</Button>
              <Button variant="outlined" color="error" onClick={resetBooking} startIcon={<RestartAltIcon />}>Reset</Button>
              <Button variant="outlined" color="secondary" onClick={randomOccupancy} startIcon={<ShuffleIcon />}>Random</Button>
            </Stack>
          </CardContent>
        </Card>

        {travelTime !== null && (
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            ✅ Total Travel Time: <b>{travelTime} mins</b> | Rooms: {lastBooked.join(", ")}
          </Typography>
        )}

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Chip label="Available" />
          <Chip label="Booked" color="success" />
          <Chip label="Last Booked" sx={{ bgcolor: "gold" }} />
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: { xs: "wrap", md: "nowrap" },
            maxWidth: 900,
            margin: "auto",
          }}
        >
          {/* LEFT PANEL */}
          <Card sx={{ p: 2, flex: "0 0 120px", textAlign: "center", mb: { xs: 2, md: 0 } }}>
            {rooms.map((_, i) => (
              <Typography key={i} variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                Floor {i + 1}
              </Typography>
            ))}
          </Card>

          {/* RIGHT PANEL */}
          <Box sx={{ flex: 1, overflowX: "auto", p: 1 }}>
            {rooms.map((floor, i) => (
              <Grid container key={i} spacing={1} sx={{ mb: 2 }}>
                {floor.map((room) => (
                  <Grid item key={room.id}>
                    <Tooltip title={`Room ${room.id} | Travel Time: ${travelFromStairs(room.floor, room.index)} mins`}>
                      <motion.div whileTap={{ scale: 0.8 }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                        <Chip
                          label={room.id}
                          color={lastBooked.includes(room.id) ? "warning" : room.booked ? "success" : "default"}
                          variant={room.booked ? "filled" : "outlined"}
                          sx={{ width: 60 }}
                          onClick={() => handleRoomClick(room)}
                          onDoubleClick={() => handleRoomDoubleClick(room)}
                        />
                      </motion.div>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.type}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </>
  );
}
