type Props = {
  data: Checklist[];
};

type Checklist = {
    _id: string;
    type: string;
    amount_of_milk_produced: number;
    number_of_cows_head: number;
    had_supervision: boolean;
    farmer: {
      name: string;
      city: string;
    };
    from: {
      name: string;
    };
    to: {
      name: string;
    };
    location: {
      latitude: number;
      longitude: number;
    };
    created_at: string;
    updated_at: string;
  };

  type UpdateChecklist = {
    type: string;
    amount_of_milk_produced: number;
    number_of_cows_head: number;
    had_supervision: boolean;
    farmer: {
      name: string;
      city: string;
    };
    from: {
      name: string;
    };
    to: {
      name: string;
    };
    location: {
      latitude: number;
      longitude: number;
    };
  };
  export type { Checklist, UpdateChecklist, Props };
