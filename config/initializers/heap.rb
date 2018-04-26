if Rails.env.production?
  Heap.app_id = ENV.fetch('HEAP_APP_ID')
else
  #Heap.app_id = 'YOUR_DEV_APP_ID'
end
