"use client";
// import DeployButton from "../components/DeployButton";
// import AuthButton from "../components/AuthButton";
// import { createClient } from "@/utils/supabase/server";
// import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
// import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";
import HorizontalLinearStepper from "@/components/HorizontalLinearStepper";
import Scheduler from "@/components/Scheduler";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
// import { supabase } from "@/utils/supabase/supabase";
import { format, addDays, setHours, setMinutes } from 'date-fns';

export default function Index() {
  const [selectedShop, setSelectedShop] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [shops, setShops] = useState<{ store_id: number; name: string }[]>([]);
  const [plans, setPlans] = useState<{ id: number; name: string; price: number }[]>([]);
  const [options, setOptions] = useState<{ id: number; name: string; price: number }[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [reservations, setReservations] = useState<{ day: number; hour: number; count: number }[]>([]);

  const supabase = createClient();

  useEffect(() => {
    console.log("fetching shops");
    fetchShops();
  }, []);

  useEffect(() => {
    console.log("selectedShop");
    if (selectedShop) {
      console.log("fetching plans");
      fetchPlans(selectedShop);
    }
  }, [selectedShop]);

  useEffect(() => {
    console.log("selectedPlan");
    if (selectedPlan) {
      console.log("fetching options");
      fetchOptions(selectedPlan);
    }
  }, [selectedPlan]);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedPlan, selectedOptions]);

  useEffect(() => {
    if (selectedShop) {
      fetchReservations(selectedShop);
    }
  }, [selectedShop, currentDate]);

  const fetchShops = async () => {
    const { data, error } = await supabase.from("stores").select("store_id, name");
    if (error) {
      console.error("Error fetching shops:", error);
    } else {
      setShops(data || []);
    }
  };

  const fetchPlans = async (shopId: number) => {
    const { data, error } = await supabase
      .from("plans")
      .select("id, name, price");
      // .eq("shop_id", shopId);
    if (error) {
      console.error("Error fetching plans:", error);
    } else {
      setPlans(data || []);
    }
  };

  const fetchOptions = async (planId: number) => {
    const { data, error } = await supabase
      .from("options")
      .select("id, name, price");
      // .eq("plan_id", planId);
    if (error) {
      console.error("Error fetching options:", error);
    } else {
      setOptions(data || []);
    }
  };

  const fetchReservations = async (shopId: number) => {
    const startDate = currentDate;
    const endDate = addDays(startDate, 6);
    const { data: reservationData, error: reservationError } = await supabase
      .from('reservations_group_hour_view')
      .select('day, hour, cnt')
      .eq('store_id', shopId);

    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('id')
      .eq('store_id', shopId);

    if (reservationError) {
      console.error('Error fetching reservations:', reservationError);
    } else if (roomError) {
      console.error('Error fetching rooms:', roomError);
    } else {
      const roomCount = roomData.length;
      setReservations(
        reservationData.map((reservation) => ({
          day: new Date(reservation.day).getDay(),
          hour: reservation.hour,
          count: roomCount - reservation.cnt,
        }))
      );
    }
  };

  const handleShopClick = (shopId: number) => {
    setSelectedShop(shopId);
    setSelectedPlan(null);
    setSelectedOptions([]);
  };

  const handlePlanClick = (planId: number) => {
    setSelectedPlan(planId);
    setSelectedOptions([]);
  };

  const handleOptionClick = (optionId: number) => {
    const index = selectedOptions.indexOf(optionId);
    if (index > -1) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const calculateTotalPrice = () => {
    const selectedPlanPrice = plans.find((plan) => plan.id === selectedPlan)?.price || 0;
    const selectedOptionsPrice = selectedOptions.reduce((total, optionId) => {
      const optionPrice = options.find((option) => option.id === optionId)?.price || 0;
      return total + optionPrice;
    }, 0);
    setTotalPrice(selectedPlanPrice + selectedOptionsPrice);
  };

  // const canInitSupabaseClient = () => {
  //   // This function is just for the interactive tutorial.
  //   // Feel free to remove it once you have Supabase connected.
  //   try {
  //     createClient();
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // };

  // const isSupabaseConnected = canInitSupabaseClient();
  // // {isSupabaseConnected && <AuthButton />}

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 5 }}>
        <h1>ブース予約</h1>
        <HorizontalLinearStepper />
        <Box>
          <Typography variant="h6">1 店舗選択</Typography>
          {shops.map((shop) => (
            <Button
              key={shop.store_id}
              variant={selectedShop === shop.store_id ? "contained" : "outlined"}
              color="primary"
              sx={{ m: 1 }}
              onClick={() => handleShopClick(shop.store_id)}
            >
              {shop.name}
            </Button>
          ))}
        </Box>
        <Box>
          <Typography variant="h6">2 プラン選択</Typography>
          {plans.map((plan) => (
            <Button
              key={plan.id}
              variant={selectedPlan === plan.id ? "contained" : "outlined"}
              color="secondary"
              sx={{ m: 1 }}
              onClick={() => handlePlanClick(plan.id)}
            >
              {plan.name} - {plan.price}円
            </Button>
          ))}
        </Box>
        <Box>
          <Typography variant="h6">3 オプション選択</Typography>
          {options.map((option) => (
            <Button
              key={option.id}
              variant={selectedOptions.includes(option.id) ? "contained" : "outlined"}
              color="secondary"
              sx={{ m: 1 }}
              onClick={() => handleOptionClick(option.id)}
            >
              {option.name} - {option.price}円
            </Button>
          ))}
        </Box>
        <Box>
          <Typography variant="h6">合計金額: {totalPrice}円</Typography>
        </Box>
        <Box>
          <Scheduler startHour={10} endHour={20} selectedShop={selectedShop} reservations={reservations} />
        </Box>
      </Paper>
    </Container>
  );
}
