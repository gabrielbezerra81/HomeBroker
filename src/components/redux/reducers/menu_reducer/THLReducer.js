import { MUDAR_VARIAVEL_THL } from "constants/MenuActionTypes";

const thlData = [
  {
    strikeLine: 27.06,
    stocks: [
      {
        symbol: "PETRH28",
        id: 200000225749,
        strike: 27.06,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "17/08/2020"
      },
      {
        symbol: "PETRI273",
        id: 200000263449,
        strike: 27.06,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "21/09/2020"
      },
      {
        symbol: "PETRJ273",
        id: 200000263421,
        strike: 27.06,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "19/10/2020"
      },
      {
        symbol: "PETRF273",
        id: 200000291986,
        strike: 27.08,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "15/06/2020"
      },
      {
        symbol: "PETRL280",
        id: 200000233297,
        strike: 27.14,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "21/12/2020"
      },
      {
        symbol: "PETRG77",
        id: 200000279052,
        strike: 27.02,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "20/07/2020"
      }
    ]
  },
  {
    strikeLine: 27.23,
    stocks: [
      {
        symbol: "PETRD275",
        id: 200000276869,
        strike: 27.23,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "20/04/2020"
      },
      {
        symbol: "PETRK275",
        id: 200000263265,
        strike: 27.23,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "16/11/2020"
      },
      {
        symbol: "PETRG275",
        id: 200000263406,
        strike: 27.27,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "20/07/2020"
      },
      {
        symbol: "PETRF275",
        id: 200000296345,
        strike: 27.33,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "15/06/2020"
      }
    ]
  },
  {
    strikeLine: 27.58,
    stocks: [
      {
        symbol: "PETRF277",
        id: 200000296136,
        strike: 27.58,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "15/06/2020"
      },
      {
        symbol: "PETRH277",
        id: 200000304047,
        strike: 27.56,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "17/08/2020"
      },
      {
        symbol: "PETRD277",
        id: 200000276669,
        strike: 27.48,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "20/04/2020"
      }
    ]
  },
  {
    strikeLine: 27.83,
    stocks: [
      {
        symbol: "PETRF28",
        id: 200000295496,
        strike: 27.83,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "15/06/2020"
      },
      {
        symbol: "PETRH279",
        id: 200000292473,
        strike: 27.81,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "17/08/2020"
      },
      {
        symbol: "PETRG279",
        id: 200000303368,
        strike: 27.77,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "20/07/2020"
      },
      {
        symbol: "PETRD281",
        id: 200000269845,
        strike: 27.73,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "20/04/2020"
      }
    ]
  },
  {
    strikeLine: 28.06,
    stocks: [
      {
        symbol: "PETRH284",
        id: 200000263240,
        strike: 28.06,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "17/08/2020"
      },
      {
        symbol: "PETRI283",
        id: 200000263262,
        strike: 28.06,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "21/09/2020"
      },
      {
        symbol: "PETRJ283",
        id: 200000263455,
        strike: 28.06,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "19/10/2020"
      },
      {
        symbol: "PETRF282",
        id: 200000295453,
        strike: 28.08,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "15/06/2020"
      },
      {
        symbol: "PETRD284",
        id: 200000270312,
        strike: 27.98,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "20/04/2020"
      }
    ]
  },
  {
    strikeLine: 28.27,
    stocks: [
      {
        symbol: "PETRG286",
        id: 200000263544,
        strike: 28.27,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "20/07/2020"
      },
      {
        symbol: "PETRK285",
        id: 200000263592,
        strike: 28.23,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "16/11/2020"
      }
    ]
  },
  {
    strikeLine: 28.52,
    stocks: [
      {
        symbol: "PETRG288",
        id: 200000300970,
        strike: 28.52,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "20/07/2020"
      }
    ]
  },
  {
    strikeLine: 28.75,
    stocks: [
      {
        symbol: "PETRE289",
        id: 200000286782,
        strike: 28.75,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "18/05/2020"
      },
      {
        symbol: "PETRD289",
        id: 200000290960,
        strike: 28.73,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "20/04/2020"
      },
      {
        symbol: "PETRL289",
        id: 200000263601,
        strike: 28.64,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "21/12/2020"
      }
    ]
  },
  {
    strikeLine: 28.89,
    stocks: [
      {
        symbol: "PETRL291",
        id: 200000281261,
        strike: 28.89,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "21/12/2020"
      },
      {
        symbol: "PETRF290",
        id: 200000305373,
        strike: 28.83,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "15/06/2020"
      }
    ]
  },
  {
    strikeLine: 28.89,
    stocks: [
      {
        symbol: "PETRL291",
        id: 200000281261,
        strike: 28.89,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "21/12/2020"
      },
      {
        symbol: "PETRF290",
        id: 200000305373,
        strike: 28.83,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "15/06/2020"
      }
    ]
  },
  {
    strikeLine: 28.89,
    stocks: [
      {
        symbol: "PETRL291",
        id: 200000281261,
        strike: 28.89,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "21/12/2020"
      },
      {
        symbol: "PETRF290",
        id: 200000305373,
        strike: 28.83,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "15/06/2020"
      }
    ]
  },
  {
    strikeLine: 28.89,
    stocks: [
      {
        symbol: "PETRL291",
        id: 200000281261,
        strike: 28.89,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "21/12/2020"
      },
      {
        symbol: "PETRF290",
        id: 200000305373,
        strike: 28.83,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "15/06/2020"
      }
    ]
  },
  {
    strikeLine: 28.89,
    stocks: [
      {
        symbol: "PETRL291",
        id: 200000281261,
        strike: 28.89,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "21/12/2020"
      },
      {
        symbol: "PETRF290",
        id: 200000305373,
        strike: 28.83,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "15/06/2020"
      }
    ]
  },
  {
    strikeLine: 28.89,
    stocks: [
      {
        symbol: "PETRL291",
        id: 200000281261,
        strike: 28.89,
        tipo: "CALL",
        modelo: "EUROPEAN",
        vencimento: "21/12/2020"
      },
      {
        symbol: "PETRF290",
        id: 200000305373,
        strike: 28.83,
        tipo: "CALL",
        modelo: "AMERICAN",
        vencimento: "15/06/2020"
      }
    ]
  }
];

const INITIAL_STATE = {
  ativoPesquisa: "petr4",
  vencimentosTHL: thlData,
  faixasMapaCalor: null,
  seletorMapaCalor: "semcor",
  listaStrikes: [
    9.0,
    11.0,
    12.0,
    13.0,
    14.0,
    15.0,
    16.0,
    17.0,
    18.0,
    19.0,
    20.0,
    21.0,
    22.0,
    23.0,
    24.0,
    25.0,
    26.0,
    27.0,
    28.0,
    29.0,
    30.0,
    31.0,
    32.0,
    33.0,
    34.0,
    35.0,
    36.0,
    37.0,
    38.0,
    39.0,
    40.0,
    41.0,
    44.0
  ]
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MUDAR_VARIAVEL_THL:
      return { ...state, [action.payload.nome]: action.payload.valor };
    default:
      return state;
  }
};
