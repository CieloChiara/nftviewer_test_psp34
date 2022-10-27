const SampleContractsList = (): JSX.Element => {
  
  const navigation = {
    shiden: [
      { name: 'CieloNFT(u32)', address: 'ZzT8xAQL96avegYRBJSHCoQG8na7YFdtMeWuZRwnWsm27Kv' },
      { name: 'PiyoNFT(u32)', address: 'WxZtwaq5DRJ8zZ1JidXyXEx1VVYMHMK4SA3jGim89bWa4Qy' },
    ],
    shibuya: [
      { name: 'CieloNFT(u32)', address: 'Wo8i6CdBGLQjMpjXocfNrfgNbfhzu1anzmYJW7dednMCpM4' },
      { name: 'PiyoNFT(u32)', address: 'W5vkB5FaPuqfiWzc8Tf3fpbWXQK7WtMnm9gaUBAw8zPGZUS' },
      { name: 'PiyoNFT(Type Id)', address: 'ZKN1C6nXkw6FFbLz2G8mwzs8SYq4uY8hjQCdQVRiUG8UjKj' },
    ],
    local: [
      { name: 'CieloNFT(u32)', address: '5Gsoxy9iZeB5DFfAofK3G4iQRef6nJuPiwH4FvuRrwTmAYr4' },
      { name: 'PiyoNFT(u32)', address: '5F2KAddG4bKHUWNnjnxZoHUNepeFMKgnZsModVYHFegqdzog' },
    ],
    custom: [
      { name: 'CieloNFT(u32)', address: 'YhnQHo51cgXCLecaSgqCZ9gfApUbB4L8jeJR7mhwnVMDwqJ' },
      { name: 'PiyoNFT(u32)', address: 'YDtdRHfNagMGVnXLDav1MdBoxY5SND76eQVTrVS6HHWoAXs' },
    ],
  };

  return (
    <div className="text-left max-w-6xl p-2 m-auto mt-5 w-11/12 border-[#323943] bg-[#121923] border border-1 rounded">
      <h3 className="m-1 text-xl text-center">Sample Contracts</h3>
      <dl role="list" className="m-1 break-all">
        <dt className="m-1 text-xl">Shiden</dt>
        {navigation.shiden.map((item) => (
          <dd className="ml-4" key={item.name}>{item.name}: {item.address}</dd>
        ))}
      </dl>
      <dl role="list" className="mt-3 m-1 break-all">
        <dt className="m-1 text-xl">Shibuya</dt>
        {navigation.shibuya.map((item) => (
          <dd className="ml-4" key={item.name}>{item.name}: {item.address}</dd>
        ))}
      </dl>
      <dl role="list" className="mt-3 m-1 break-all">
        <dt className="m-1 text-xl">Local</dt>
        {navigation.local.map((item) => (
          <dd className="ml-4" key={item.name}>{item.name}: {item.address}</dd>
        ))}
      </dl>
      <dl role="list" className="mt-3 m-1 break-all">
        <dt className="m-1 text-xl">Custom</dt>
        {navigation.custom.map((item) => (
          <dd className="ml-4" key={item.name}>{item.name}: {item.address}</dd>
        ))}
      </dl>
    </div>
  );
};

export default SampleContractsList;