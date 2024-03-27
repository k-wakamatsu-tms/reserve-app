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

export default function Index() {
  const [selectedShop, setSelectedShop] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [shops, setShops] = useState<{ store_id: number; name: string }[]>([]);

  const supabase = createClient();

  useEffect(() => {
    console.log("fetching shops");
    fetchShops();
  }, []);

  const fetchShops = async () => {
    const { data, error } = await supabase.from("stores").select("store_id, name");
    if (error) {
      console.error("Error fetching shops:", error);
    } else {
      console.log("fetching shops success");
      console.log(data);
      setShops(data || []);
    }
  };

  const handleShopClick = (shopId: number) => {
    setSelectedShop(shopId);
  };

  const handlePlanClick = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleOptionClick = (option: string) => {
    const index = selectedOptions.indexOf(option);
    if (index > -1) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
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
          {["プランA", "プランB"].map((plan, index) => (
            <Button
              key={index}
              variant={selectedPlan === plan ? "contained" : "outlined"}
              color="secondary"
              sx={{ m: 1 }}
              onClick={() => handlePlanClick(plan)}
            >
              {plan}
            </Button>
          ))}
        </Box>
        <Box>
          <Typography variant="h6">3 オプション選択</Typography>
          {["オプションA", "オプションB", "オプションC"].map(
            (option, index) => (
              <Button
                key={index}
                variant={
                  selectedOptions.includes(option) ? "contained" : "outlined"
                }
                color="secondary"
                sx={{ m: 1 }}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </Button>
            )
          )}
        </Box>
        <Box>
          <Scheduler startHour={10} endHour={20} />
        </Box>
      </Paper>
    </Container>
  );
}
